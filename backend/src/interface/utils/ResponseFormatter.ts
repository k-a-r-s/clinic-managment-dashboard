import { Response } from "express";

export interface ApiErrorObject {
  type: string;
  message: string;
  [key: string]: any;
}

/**
 * Utility class for formatting standardized API responses
 * Ensures consistent response structure across all endpoints
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: T | null,
 *   error: ErrorObject | null
 * }
 */
export class ResponseFormatter {
  /**
   * Send a success response in the standard format
   * @param res Express Response object
   * @param data The response data payload
   * @param message Success message
   * @param statusCode HTTP status code (default: 200)
   */
  static success<T>(
    res: Response,
    data: T | null = null,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message: message,
      data: data,
      error: null,
    });
  }

  /**
   * Send an error response in the standard format
   * @param res Express Response object
   * @param errorObject Error object with type and message
   * @param statusCode HTTP status code
   * @param message Error message
   */
  static error(
    res: Response,
    errorObject: ApiErrorObject,
    statusCode: number = 400,
    message?: string
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message: message || errorObject.message,
      data: null,
      error: errorObject,
    });
  }
}
