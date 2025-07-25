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

interface ElevenLabsResponse {
  audio: ArrayBuffer;
}

// Note: API key should be provided by the user
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

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

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error calling ElevenLabs API:', error);
    throw error;
  }
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