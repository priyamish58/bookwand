# Network Connectivity Fix Plan

## Issue Identified
The application is experiencing network connectivity issues when trying to connect to the OpenAI and ElevenLabs APIs. The browser console shows `net::ERR_CONNECTION_REFUSED` errors, indicating that the connection to the API servers cannot be established.

## Root Causes
The `ERR_CONNECTION_REFUSED` error typically occurs due to one of the following reasons:

1. **CORS (Cross-Origin Resource Sharing) Issues**: When making API requests from a browser, CORS policies might prevent direct connections to external APIs.
2. **Network Connectivity**: There might be issues with the internet connection or network configuration.
3. **Firewall/Proxy Blocking**: A firewall or proxy might be blocking outbound connections to the API domains.
4. **Incorrect API Endpoints**: The API endpoints might be incorrect or have changed.

## Proposed Solutions

### 1. Add CORS Proxy Support
Modify the API utility files to use a CORS proxy when direct connections fail. This will help bypass CORS restrictions in development environments.

#### Changes to `src/utils/openai.ts`:
```typescript
export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
  private useCorsProxy = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    try {
      // Try direct connection first
      return await fetch(url, options);
    } catch (error) {
      // If connection refused and retries left, try with CORS proxy
      if (error instanceof Error && 
          error.message.includes('Failed to fetch') && 
          !this.useCorsProxy && 
          retries > 0) {
        console.log('Direct connection failed, trying with CORS proxy...');
        this.useCorsProxy = true;
        const proxyUrl = this.corsProxyUrl + url;
        return this.fetchWithRetry(proxyUrl, options, retries - 1);
      }
      throw error;
    }
  }

  // Update all API methods to use fetchWithRetry
  // Example for summarizeDocument:
  async summarizeDocument(content: string, documentName: string): Promise<string> {
    try {
      const messages = [/* existing messages */];
      
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
          max_tokens: 800,
          temperature: 0.7,
        }),
      };

      const response = await this.fetchWithRetry(url, options);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error details:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate summary.';
    } catch (error) {
      console.error('Error summarizing document:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      throw new Error('Failed to summarize document. Please check your network connection and try again.');
    }
  }

  // Similar updates for other methods...
}
```

#### Changes to `src/utils/elevenlabs.ts`:
```typescript
// Add similar CORS proxy and retry logic
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
let useCorsProxy = false;

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  try {
    // Try direct connection first
    return await fetch(url, options);
  } catch (error) {
    // If connection refused and retries left, try with CORS proxy
    if (error instanceof Error && 
        error.message.includes('Failed to fetch') && 
        !useCorsProxy && 
        retries > 0) {
      console.log('Direct connection failed, trying with CORS proxy...');
      useCorsProxy = true;
      const proxyUrl = CORS_PROXY_URL + url;
      return fetchWithRetry(proxyUrl, options, retries - 1);
    }
    throw error;
  }
}

export async function textToSpeech({
  text,
  character,
  model = 'eleven_multilingual_v2'
}: TextToSpeechOptions): Promise<ArrayBuffer> {
  // Existing code...
  
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

    const response = await fetchWithRetry(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error details:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error calling ElevenLabs API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw new Error('Failed to generate speech. Please check your network connection and try again.');
  }
}
```

### 2. Add Network Status Check
Add a utility function to check network status before making API calls:

```typescript
// src/utils/networkUtils.ts
export async function checkNetworkConnectivity(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    });
    return true;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
}
```

### 3. Improve Error Handling
Enhance error handling in both API utilities to provide more specific error messages based on the type of error:

- Network connectivity issues
- API key validation issues
- Rate limiting issues
- Other API-specific errors

### 4. Add Fallback Endpoints
Consider adding fallback endpoints or alternative API providers if the primary ones are unavailable.

## Implementation Plan

1. Switch to Code mode to implement these changes
2. Start with adding the CORS proxy support to both API utilities
3. Implement better error handling with detailed logging
4. Test the changes with various network conditions
5. Add the network status check utility if needed

## Additional Recommendations

1. **Check Firewall Settings**: Ensure that your firewall is not blocking connections to the API domains.
2. **Verify Network Configuration**: Check if there are any proxy settings or VPN configurations that might be affecting the connections.
3. **Consider Using a Backend Proxy**: For production applications, consider implementing a backend proxy server to handle API requests instead of making them directly from the browser.