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
