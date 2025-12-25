import type { Curriculum } from '../types/curriculum.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * API Response Types
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface GenerateCurriculumResponse {
  curriculum: Curriculum;
  aiProvider: string;
}

/**
 * API Error Class
 */
export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * API Service
 * 
 * Handles all API communication with the backend.
 */
export const api = {
  /**
   * Generate curriculum from uploaded PDF
   * @param file - PDF file to upload
   * @returns Generated curriculum
   */
  async generateCurriculum(file: File): Promise<GenerateCurriculumResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/curriculum/generate`, {
      method: 'POST',
      body: formData,
    });

    const result: ApiResponse<GenerateCurriculumResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new ApiError(
        result.error?.message || 'Failed to generate curriculum',
        result.error?.code || 'UNKNOWN_ERROR'
      );
    }

    return result.data;
  },

  /**
   * Generate curriculum with streaming
   * @param file - PDF file to upload
   * @param onProgress - Callback for progress updates
   * @param onChunk - Optional callback for chunk updates
   * @returns Promise of generated curriculum
   */
  async generateCurriculumStream(
    file: File,
    onProgress: (status: string, message: string) => void,
    onChunk?: (chunk: string, index: number) => void
  ): Promise<GenerateCurriculumResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      fetch(`${API_BASE_URL}/curriculum/generate-stream`, {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new ApiError(
              `HTTP error! status: ${response.status}`,
              'HTTP_ERROR'
            );
          }

          if (!response.body) {
            throw new ApiError('No response body', 'NO_RESPONSE_BODY');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          // Read the stream
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
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

              if (!data) continue;

              try {
                const parsedData = JSON.parse(data);

                switch (eventType) {
                  case 'progress':
                    onProgress(parsedData.status, parsedData.message);
                    break;

                  case 'chunk':
                    if (onChunk) {
                      onChunk(parsedData.chunk, parsedData.chunkIndex);
                    }
                    break;

                  case 'complete':
                    resolve({
                      curriculum: parsedData.curriculum,
                      aiProvider: parsedData.aiProvider,
                    });
                    break;

                  case 'error':
                    reject(new ApiError(parsedData.message, parsedData.code));
                    break;
                }
              } catch (error) {
                console.error('Failed to parse SSE data:', error);
              }
            }
          }
        })
        .catch((error) => {
          reject(
            error instanceof ApiError
              ? error
              : new ApiError(
                  error instanceof Error ? error.message : 'Unknown error',
                  'STREAM_ERROR'
                )
          );
        });
    });
  },

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; aiProvider: string }> {
    const response = await fetch(`${API_BASE_URL}/curriculum/health`);
    const result: ApiResponse<{ status: string; aiProvider: string; timestamp: string }> = await response.json();

    if (!result.success || !result.data) {
      throw new ApiError(
        result.error?.message || 'Health check failed',
        result.error?.code || 'HEALTH_CHECK_ERROR'
      );
    }

    return result.data;
  },
};
