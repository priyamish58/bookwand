/**
 * Network Utilities
 * 
 * This file contains utility functions for network operations,
 * including connectivity checks and error handling.
 */

/**
 * Check if the device has internet connectivity
 * @returns Promise<boolean> - True if connected, false otherwise
 */
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

/**
 * Parse API error responses
 * @param response - The fetch Response object
 * @returns Promise<string> - Formatted error message
 */
export async function parseApiError(response: Response): Promise<string> {
  try {
    // Try to parse as JSON first
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorJson = await response.json();
      if (errorJson.error) {
        return `${response.status}: ${errorJson.error.message || errorJson.error}`;
      }
    }
    
    // Fallback to text
    const errorText = await response.text();
    return `${response.status}: ${errorText || 'Unknown error'}`;
  } catch (error) {
    return `${response.status}: Could not parse error response`;
  }
}

/**
 * Determine if an error is related to network connectivity
 * @param error - The error object
 * @returns boolean - True if it's a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  const networkErrorMessages = [
    'Failed to fetch',
    'NetworkError',
    'Network request failed',
    'ERR_CONNECTION_REFUSED',
    'ERR_NETWORK',
    'ERR_INTERNET_DISCONNECTED',
    'ERR_NAME_NOT_RESOLVED'
  ];
  
  return networkErrorMessages.some(msg => error.message.includes(msg));
}

/**
 * Get a user-friendly error message based on the error type
 * @param error - The error object
 * @param defaultMessage - Default message to show
 * @returns string - User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown, defaultMessage: string): string {
  if (!(error instanceof Error)) return defaultMessage;
  
  if (isNetworkError(error)) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  if (error.message.includes('401') || error.message.includes('403')) {
    return 'Authentication error. Please check your API key and try again.';
  }
  
  if (error.message.includes('429')) {
    return 'Rate limit exceeded. Please try again later.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. The service might be experiencing issues. Please try again later.';
  }
  
  return defaultMessage;
}

/**
 * Create a CORS proxy URL
 * @param originalUrl - The original URL
 * @returns string - The proxied URL
 */
export function createProxyUrl(originalUrl: string): string {
  const corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];
  
  // Use the first proxy by default, but could implement fallback logic
  return `${corsProxies[0]}${originalUrl}`;
}