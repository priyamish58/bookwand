import {
  checkNetworkConnectivity,
  parseApiError,
  isNetworkError,
  getUserFriendlyErrorMessage,
  createProxyUrl
} from './networkUtils';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface OpenAITTSResponse {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private useCorsProxy = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 3, backoffMs = 1000): Promise<Response> {
    try {
      // Try direct connection first
      const response = await fetch(url, options);
      
      // Handle rate limiting with exponential backoff
      if (response.status === 429 && retries > 0) {
        console.log(`Rate limit exceeded. Retrying in ${backoffMs/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        return this.fetchWithRetry(url, options, retries - 1, backoffMs * 2);
      }
      
      return response;
    } catch (error) {
      // If network error and retries left, try with CORS proxy
      if (isNetworkError(error) && !this.useCorsProxy && retries > 0) {
        console.log('Direct connection failed, trying with CORS proxy...', error);
        this.useCorsProxy = true;
        const proxyUrl = createProxyUrl(url);
        return this.fetchWithRetry(proxyUrl, options, retries - 1, backoffMs);
      }
      throw error;
    }
  }

  async summarizeDocument(content: string, documentName: string): Promise<string> {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a magical AI assistant that helps students understand and learn from documents. Create engaging and insightful summaries with a touch of magical Harry Potter theme. Be helpful, educational, and slightly whimsical.`
        },
        {
          role: 'user',
          content: `Please create a comprehensive summary of this document titled "${documentName}". Make it educational and engaging:\n\n${content.slice(0, 8000)}`
        }
      ];

      const url = `${this.baseUrl}/chat/completions`;
      console.log("API Key being used:", this.apiKey);

      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      };

      // Use fetchWithRetry to handle network issues
      const response = await this.fetchWithRetry(url, options);

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error('OpenAI API error details:', errorMessage);
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate summary.';
    } catch (error) {
      console.error('Error summarizing document:', error);
      const friendlyMessage = getUserFriendlyErrorMessage(
        error,
        'Failed to summarize document. Please check your API key and try again.'
      );
      throw new Error(friendlyMessage);
    }
  }

  async explainWord(word: string, context: string): Promise<string> {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a magical Word Wizard that helps students understand difficult words and concepts. Explain words in an engaging, educational way with magical metaphors when appropriate. Keep explanations clear and student-friendly.`
        },
        {
          role: 'user',
          content: `Please explain the word "${word}" in the context: "${context.slice(0, 500)}". Provide definition, usage examples, and any helpful mnemonics or magical connections.`
        }
      ];

      const url = `${this.baseUrl}/chat/completions`;
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      };

      // Use fetchWithRetry to handle network issues
      const response = await this.fetchWithRetry(url, options);

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error('OpenAI API error details:', errorMessage);
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to explain word.';
    } catch (error) {
      console.error('Error explaining word:', error);
      const friendlyMessage = getUserFriendlyErrorMessage(
        error,
        'Failed to explain word. Please check your API key and try again.'
      );
      throw new Error(friendlyMessage);
    }
  }

  async textToSpeech(text: string, voice: string = 'alloy'): Promise<ArrayBuffer> {
    try {
      const voiceMap: Record<string, string> = {
        'hermione': 'nova',
        'snape': 'onyx',
        'dumbledore': 'echo',
        'hagrid': 'fable',
        'mcgonagall': 'shimmer',
        'default': 'alloy'
      };

      const selectedVoice = voiceMap[voice] || voiceMap['default'];

      const url = `${this.baseUrl}/audio/speech`;
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text.slice(0, 4000), // OpenAI TTS has a character limit
          voice: selectedVoice,
          speed: 1.0
        }),
      };

      // Use fetchWithRetry to handle network issues
      const response = await this.fetchWithRetry(url, options);

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error('OpenAI TTS API error details:', errorMessage);
        throw new Error(`OpenAI TTS API error: ${errorMessage}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      const friendlyMessage = getUserFriendlyErrorMessage(
        error,
        'Failed to generate speech. Please check your API key and try again.'
      );
      throw new Error(friendlyMessage);
    }
  }
}

export const createOpenAIService = (apiKey?: string) => {
  // Use provided API key or the one from environment
  const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!key || key === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('❌ OpenAI API key not found. Please check your .env file contains VITE_OPENAI_API_KEY');
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
  
  return new OpenAIService(key);
};