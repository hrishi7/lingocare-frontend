import type { 
  StreamingCallbacks, 
  ProgressEventData,
  ChunkEventData,
  CompleteEventData,
  ErrorEventData,
} from '../types/streaming.types';

/**
 * SSE Streaming Client
 * 
 * Manages Server-Sent Events connection for curriculum generation.
 * Provides callbacks for different event types and handles connection lifecycle.
 */
export class StreamingClient {
  private eventSource: EventSource | null = null;
  private callbacks: StreamingCallbacks;

  constructor(callbacks: StreamingCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Start streaming from the given URL
   * @param url - SSE endpoint URL
   * @param file - PDF file to upload
   */
  async start(url: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create FormData with file
      const formData = new FormData();
      formData.append('file', file);

      // Create a temporary URL for the upload
      // Note: EventSource doesn't support POST, so we need to use fetch with ReadableStream
      this.startWithFetch(url, formData, resolve, reject);
    });
  }

  /**
   * Start streaming using fetch API with ReadableStream
   */
  private async startWithFetch(
    url: string,
    formData: FormData,
    resolve: () => void,
    reject: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          resolve();
          break;
        }

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const messages = buffer.split('\n\n');
        buffer = messages.pop() || ''; // Keep incomplete message in buffer

        for (const message of messages) {
          if (message.trim() === '') continue;
          if (message.startsWith(':')) continue; // Comment/keep-alive

          this.processSSEMessage(message);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.callbacks.onError({
        code: 'STREAM_ERROR',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
      reject(error instanceof Error ? error : new Error(errorMessage));
    }
  }

  /**
   * Process a single SSE message
   */
  private processSSEMessage(message: string): void {
    const lines = message.split('\n');
    let eventType: string | null = null;
    let data: string | null = null;

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        data = line.substring(5).trim();
      }
    }

    if (!data) return;

    try {
      const parsedData = JSON.parse(data);

      switch (eventType) {
        case 'progress':
          if (this.callbacks.onProgress) {
            this.callbacks.onProgress(parsedData as ProgressEventData);
          }
          break;

        case 'chunk':
          if (this.callbacks.onChunk) {
            this.callbacks.onChunk(parsedData as ChunkEventData);
          }
          break;

        case 'complete':
          this.callbacks.onComplete(parsedData as CompleteEventData);
          break;

        case 'error':
          this.callbacks.onError(parsedData as ErrorEventData);
          break;

        default:
          console.log('Unknown event type:', eventType);
      }
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
    }
  }

  /**
   * Close the streaming connection
   */
  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

/**
 * Create and start a streaming client
 * Convenience function for one-off streaming
 */
export async function streamGeneration(
  url: string,
  file: File,
  callbacks: StreamingCallbacks
): Promise<void> {
  const client = new StreamingClient(callbacks);
  try {
    await client.start(url, file);
  } finally {
    client.close();
  }
}
