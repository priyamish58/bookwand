import {
  checkNetworkConnectivity,
  parseApiError,
  isNetworkError,
  getUserFriendlyErrorMessage,
  createProxyUrl
} from './networkUtils';

// ElevenLabs Text-to-Speech API Integration
// Character voice mappings for magical characters
const CHARACTER_VOICES = {
  hermione: '9BWtsMINqrJLrRacOk9x', // Aria - suitable for intelligent, articulate character
  snape: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - deep, authoritative voice
  harry: 'IKne3meq5aSn9XLyUdCD', // Charlie - young, determined voice
  dumbledore: 'JBFqnCBsd6RMkjVDRZzb', // George - wise, gentle voice
  mcgonagall: 'XB0fDUnXU5powFXDhCwa', // Charlotte - stern but caring
  hagrid: 'bIHbv24MWmeRgasZH58o', // Will - warm, friendly voice
  luna: 'XrExE9yKIg1WjnnlVkGX', // Matilda - dreamy, ethereal voice
  ron: 'onwK4e9ZLuTAKqWW03F9', // Daniel - loyal, expressive voice
  draco: 'nPczCjzI2devNBz1zQrb', // Brian - smooth, aristocratic voice
  narrator: 'EXAVITQu4vr4xnSDxMaL', // Sarah - clear, engaging narrator voice
} as const;

export type CharacterVoice = keyof typeof CHARACTER_VOICES;

interface TextToSpeechOptions {
  text: string;
  character: CharacterVoice;
  model?: string;
}

// No need for this interface as it's not used
// interface ElevenLabsResponse {
//   audio: ArrayBuffer;
// }

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
let useCorsProxy = false;

// Global rate limiter to track API usage
class RateLimiter {
  private requestTimestamps: number[] = [];
  private readonly maxRequestsPerMinute: number = 10; // Adjust based on your ElevenLabs plan
  private readonly timeWindow: number = 60 * 1000; // 1 minute in milliseconds

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove timestamps older than the time window
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    return this.requestTimestamps.length < this.maxRequestsPerMinute;
  }

  recordRequest(): void {
    this.requestTimestamps.push(Date.now());
  }

  getTimeUntilNextAvailable(): number {
    if (this.canMakeRequest()) return 0;
    
    const now = Date.now();
    const oldestTimestamp = this.requestTimestamps[0];
    return Math.max(0, this.timeWindow - (now - oldestTimestamp));
  }
}

// Request queue to prevent concurrent requests
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing: boolean = false;
  private rateLimiter: RateLimiter;

  constructor(rateLimiter: RateLimiter) {
    this.rateLimiter = rateLimiter;
  }

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          // Wait until we can make a request according to rate limits
          while (!this.rateLimiter.canMakeRequest()) {
            const waitTime = this.rateLimiter.getTimeUntilNextAvailable();
            console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime/1000)} seconds before next request...`);
            await new Promise(r => setTimeout(r, waitTime + 100)); // Add a small buffer
          }
          
          // Record this request
          this.rateLimiter.recordRequest();
          
          // Execute the request
          const result = await requestFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      try {
        await request();
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
    }
    
    this.processing = false;
  }
}

// Initialize global instances
const rateLimiter = new RateLimiter();
const requestQueue = new RequestQueue(rateLimiter);

/**
 * Fetch with retry and CORS proxy fallback
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retries - Number of retries
 * @returns Promise<Response>
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 5, backoffMs = 2000): Promise<Response> {
  try {
    // Try direct connection first
    const response = await fetch(url, options);
    
    // Handle rate limiting with exponential backoff
    if (response.status === 429 && retries > 0) {
      const retryAfter = response.headers.get('Retry-After');
      let waitTime = backoffMs;
      
      // Use Retry-After header if available
      if (retryAfter) {
        const retrySeconds = parseInt(retryAfter, 10);
        if (!isNaN(retrySeconds)) {
          waitTime = retrySeconds * 1000;
        }
      }
      
      console.log(`Rate limit exceeded. Retrying in ${waitTime/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
    }
    
    return response;
  } catch (error) {
    // If network error and retries left, try with CORS proxy
    if (isNetworkError(error) && !useCorsProxy && retries > 0) {
      console.log('Direct connection to ElevenLabs failed, trying with CORS proxy...', error);
      useCorsProxy = true;
      const proxyUrl = createProxyUrl(url);
      return fetchWithRetry(proxyUrl, options, retries - 1, backoffMs);
    }
    throw error;
  }
}

// Check network connectivity
checkNetworkConnectivity()
  .then(isConnected => {
    if (!isConnected) {
      console.warn('Network connectivity check failed. Internet connection may be unavailable.');
    }
  })
  .catch(error => {
    console.warn('Network connectivity check error:', error);
  });

/**
 * Converts text to speech using ElevenLabs API with character voices
 * @param options - Text to convert, character voice, and optional model
 * @returns Promise<ArrayBuffer> - Audio data that can be played
 */
export async function textToSpeech({
  text,
  character,
  model = 'eleven_multilingual_v2'
}: TextToSpeechOptions): Promise<ArrayBuffer> {
  const voiceId = CHARACTER_VOICES[character];
  
  if (!voiceId) {
    throw new Error(`Voice not found for character: ${character}`);
  }

  if (!ELEVENLABS_API_KEY) {
    throw new Error('❌ ElevenLabs API key not found. Please check your .env file.');
  }

  // Add the request to the queue to prevent concurrent requests
  return requestQueue.add(async () => {
    try {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      };

      // Use fetchWithRetry to handle network issues
      const response = await fetchWithRetry(url, options);

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error('ElevenLabs API error details:', errorMessage);
        
        if (response.status === 429) {
          throw new Error(`ElevenLabs API rate limit exceeded. Please try again later or reduce the frequency of requests.`);
        }
        
        throw new Error(`ElevenLabs API error: ${errorMessage}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error calling ElevenLabs API:', error);
      const friendlyMessage = getUserFriendlyErrorMessage(
        error,
        'Failed to generate speech. Please check your API key and try again.'
      );
      throw new Error(friendlyMessage);
    }
  });
}

/**
 * Plays audio from ArrayBuffer
 * @param audioBuffer - Audio data from ElevenLabs API
 * @returns Promise<HTMLAudioElement> - Audio element for playback control
 */
export async function playAudio(audioBuffer: ArrayBuffer): Promise<HTMLAudioElement> {
  const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(blob);
  
  const audio = new Audio(audioUrl);
  
  // Clean up the object URL when audio ends
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(audioUrl);
  });
  
  await audio.play();
  return audio;
}

/**
 * Get available character voices
 * @returns Array of character names
 */
export function getAvailableCharacters(): CharacterVoice[] {
  return Object.keys(CHARACTER_VOICES) as CharacterVoice[];
}

/**
 * Get character voice display name
 * @param character - Character key
 * @returns Formatted display name
 */
export function getCharacterDisplayName(character: CharacterVoice): string {
  const names: Record<CharacterVoice, string> = {
    hermione: 'Hermione Granger',
    snape: 'Severus Snape',
    harry: 'Harry Potter',
    dumbledore: 'Albus Dumbledore',
    mcgonagall: 'Professor McGonagall',
    hagrid: 'Rubeus Hagrid',
    luna: 'Luna Lovegood',
    ron: 'Ron Weasley',
    draco: 'Draco Malfoy',
    narrator: 'Magical Narrator'
  };
  
  return names[character] || character;
}