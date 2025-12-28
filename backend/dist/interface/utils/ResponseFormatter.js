"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
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
class ResponseFormatter {
    /**
     * Send a success response in the standard format
     * @param res Express Response object
     * @param data The response data payload
     * @param message Success message
     * @param statusCode HTTP status code (default: 200)
     */
    static success(res, data = null, message = "Success", statusCode = 200) {
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
    static error(res, errorObject, statusCode = 400, message) {
        return res.status(statusCode).json({
            success: false,
            message: message || errorObject.message,
            data: null,
            error: errorObject,
        });
    }
}
exports.ResponseFormatter = ResponseFormatter;
