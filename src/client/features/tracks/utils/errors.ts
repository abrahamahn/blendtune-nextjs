// src\client\features\tracks\utils\errors.ts
import { isObject } from 'lodash';

/**
 * Enhanced error codes with more granular sub-codes
 */
export enum TrackErrorCode {
  // Fetch-related errors
  FETCH_FAILED = 'TRACK_FETCH_FAILED',
  FETCH_NETWORK_ERROR = 'TRACK_FETCH_NETWORK_ERROR',
  FETCH_TIMEOUT = 'TRACK_FETCH_TIMEOUT',
  FETCH_UNAUTHORIZED = 'TRACK_FETCH_UNAUTHORIZED',
  FETCH_NOT_FOUND = 'TRACK_FETCH_NOT_FOUND',
  
  // Processing errors
  INVALID_FORMAT = 'TRACK_INVALID_FORMAT',
  MISSING_DATA = 'TRACK_MISSING_DATA',
  PARSING_ERROR = 'TRACK_PARSING_ERROR',
  
  // Runtime errors
  PLAYBACK_ERROR = 'TRACK_PLAYBACK_ERROR',
  PLAYBACK_NETWORK_ERROR = 'TRACK_PLAYBACK_NETWORK_ERROR',
  PLAYBACK_CODEC_ERROR = 'TRACK_PLAYBACK_CODEC_ERROR',
  
  // Metadata errors
  METADATA_ERROR = 'TRACK_METADATA_ERROR',
  METADATA_INCOMPLETE = 'TRACK_METADATA_INCOMPLETE',
  METADATA_VALIDATION_ERROR = 'TRACK_METADATA_VALIDATION_ERROR',
  
  // Fallback
  UNKNOWN_ERROR = 'TRACK_UNKNOWN_ERROR'
}

/**
 * Error logging interface for centralized error tracking
 */
interface ErrorLogger {
  /**
   * Log an error with optional context
   * @param error - The error to log
   * @param context - Additional context about the error
   */
  logError(error: Error | TrackError, context?: Record<string, any>): void;
}

/**
 * Default no-op logger that can be replaced with a real implementation
 */
class DefaultErrorLogger implements ErrorLogger {
  logError(error: Error | TrackError, context?: Record<string, any>): void {
    console.error('Track Error:', error, context);
  }
}

/**
 * Global error logger instance
 */
let errorLogger: ErrorLogger = new DefaultErrorLogger();

/**
 * Set a custom error logger for centralized error tracking
 * @param logger - The error logger implementation
 */
export function setErrorLogger(logger: ErrorLogger): void {
  errorLogger = logger;
}

/**
 * Specialized error class for track-related errors
 * Includes error code, optional details, and enhanced logging
 */
export class TrackError extends Error {
  /**
   * Creates a new TrackError
   * 
   * @param message - Human-readable error message
   * @param code - Error code from TrackErrorCode enum
   * @param details - Optional additional error details
   */
  constructor(
    message: string, 
    public code: TrackErrorCode = TrackErrorCode.UNKNOWN_ERROR, 
    public details?: any
  ) {
    super(message);
    this.name = 'TrackError';
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, TrackError.prototype);
    
    // Log the error automatically
    this.logError();
  }

  /**
   * Log the error using the current error logger
   * @param additionalContext - Optional additional context for logging
   */
  logError(additionalContext?: Record<string, any>): void {
    const context = {
      ...(isObject(this.details) ? this.details : { details: this.details }),
      ...additionalContext
    };
    
    errorLogger.logError(this, context);
  }

  /**
   * Convert error to a plain object for serialization
   * @returns Serializable error representation
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack
    };
  }
}

/**
 * Type guard to check if an error is a TrackError
 * 
 * @param error - Error to check
 * @returns Whether the error is a TrackError
 */
export const isTrackError = (error: unknown): error is TrackError => {
  return error instanceof TrackError;
};

/**
 * Handles any error by converting it to a standardized format
 * If it's already a TrackError, returns it as is
 * Otherwise, wraps it in a TrackError
 * 
 * @param error - Error to handle
 * @param defaultMessage - Default message to use if error isn't an Error object
 * @returns Normalized error information
 */
export const handleTrackError = (
  error: unknown, 
  defaultMessage = 'An error occurred while processing track data'
): { message: string; code: TrackErrorCode; details?: any } => {
  // Already a TrackError, return as is
  if (isTrackError(error)) {
    return { 
      message: error.message, 
      code: error.code,
      details: error.details 
    };
  }
  
  // Standard Error object
  if (error instanceof Error) {
    // Specific error type detection
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return { 
        message: 'Request timed out while fetching track data', 
        code: TrackErrorCode.FETCH_TIMEOUT,
        details: error
      };
    }

    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return { 
        message: 'Network error while fetching track data', 
        code: TrackErrorCode.FETCH_NETWORK_ERROR,
        details: error
      };
    }
    
    // Generic Error conversion
    return { 
      message: error.message, 
      code: TrackErrorCode.UNKNOWN_ERROR,
      details: error
    };
  }
  
  // Unknown error type
  return { 
    message: defaultMessage, 
    code: TrackErrorCode.UNKNOWN_ERROR,
    details: error
  };
};

/**
 * Creates a new TrackError for specific fetch failures
 * 
 * @param status - HTTP status code
 * @param details - Optional error details
 * @returns TrackError with appropriate code and message
 */
export const createFetchError = (status: number, details?: any): TrackError => {
  let code: TrackErrorCode;
  let message: string;

  switch (status) {
    case 401:
      code = TrackErrorCode.FETCH_UNAUTHORIZED;
      message = 'Unauthorized access to track data';
      break;
    case 404:
      code = TrackErrorCode.FETCH_NOT_FOUND;
      message = 'Track data not found';
      break;
    default:
      code = TrackErrorCode.FETCH_FAILED;
      message = `Failed to fetch track data (Status: ${status})`;
  }

  return new TrackError(message, code, details);
};

/**
 * Creates a new TrackError for playback issues
 * 
 * @param type - Type of playback error
 * @param details - Optional error details
 * @returns TrackError with appropriate code and message
 */
export const createPlaybackError = (
  type: 'network' | 'codec' | 'unknown' = 'unknown', 
  details?: any
): TrackError => {
  let code: TrackErrorCode;
  let message: string;

  switch (type) {
    case 'network':
      code = TrackErrorCode.PLAYBACK_NETWORK_ERROR;
      message = 'Network error during track playback';
      break;
    case 'codec':
      code = TrackErrorCode.PLAYBACK_CODEC_ERROR;
      message = 'Codec error during track playback';
      break;
    default:
      code = TrackErrorCode.PLAYBACK_ERROR;
      message = 'Error playing track audio';
  }

  return new TrackError(message, code, details);
};

/**
 * Creates a new TrackError for metadata-related issues
 * 
 * @param type - Type of metadata error
 * @param details - Optional error details
 * @returns TrackError with appropriate code and message
 */
export const createMetadataError = (
  type: 'incomplete' | 'validation' | 'unknown' = 'unknown',
  details?: any
): TrackError => {
  let code: TrackErrorCode;
  let message: string;

  switch (type) {
    case 'incomplete':
      code = TrackErrorCode.METADATA_INCOMPLETE;
      message = 'Incomplete track metadata';
      break;
    case 'validation':
      code = TrackErrorCode.METADATA_VALIDATION_ERROR;
      message = 'Track metadata validation failed';
      break;
    default:
      code = TrackErrorCode.METADATA_ERROR;
      message = 'Error processing track metadata';
  }

  return new TrackError(message, code, details);
};