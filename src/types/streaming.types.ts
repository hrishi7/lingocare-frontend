/**
 * Frontend Streaming Types
 * 
 * Type definitions for handling SSE streaming on the client side.
 */

/**
 * Stream Event Types
 * Must match backend event types
 */
export enum StreamEventType {
  PROGRESS = 'progress',
  CHUNK = 'chunk',
  COMPLETE = 'complete',
  ERROR = 'error',
  PING = 'ping',
}

/**
 * Progress Status
 */
export enum ProgressStatus {
  STARTED = 'started',
  PARSING_PDF = 'parsing_pdf',
  PDF_PARSED = 'pdf_parsed',
  GENERATING_CURRICULUM = 'generating_curriculum',
  AI_PROCESSING = 'ai_processing',
  PARSING_RESPONSE = 'parsing_response',
  COMPLETED = 'completed',
}

/**
 * Progress Event Data
 */
export interface ProgressEventData {
  status: ProgressStatus;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Chunk Event Data
 */
export interface ChunkEventData {
  chunk: string;
  chunkIndex: number;
  timestamp: string;
}

/**
 * Complete Event Data
 */
export interface CompleteEventData {
  curriculum: unknown; // Typed as Curriculum when imported
  aiProvider: string;
  processingTime: number;
  timestamp: string;
}

/**
 * Error Event Data
 */
export interface ErrorEventData {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

/**
 * Streaming Callbacks
 */
export interface StreamingCallbacks {
  onProgress?: (data: ProgressEventData) => void;
  onChunk?: (data: ChunkEventData) => void;
  onComplete: (data: CompleteEventData) => void;
  onError: (data: ErrorEventData) => void;
}

/**
 * Streaming State
 */
export interface StreamingState {
  isStreaming: boolean;
  currentStatus?: ProgressStatus;
  currentMessage?: string;
  chunksReceived: number;
  error?: string;
}
