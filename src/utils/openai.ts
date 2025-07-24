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

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate summary.';
    } catch (error) {
      console.error('Error summarizing document:', error);
      throw new Error('Failed to summarize document. Please check your API key and try again.');
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

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to explain word.';
    } catch (error) {
      console.error('Error explaining word:', error);
      throw new Error('Failed to explain word. Please check your API key and try again.');
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

      const response = await fetch(`${this.baseUrl}/audio/speech`, {
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
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS API error: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw new Error('Failed to generate speech. Please check your API key and try again.');
    }
  }
}

export const createOpenAIService = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }
  return new OpenAIService(apiKey);
};