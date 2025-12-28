"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AuthError_1 = require("../../infrastructure/errors/AuthError");
const AppError_1 = require("../../infrastructure/errors/AppError");
const ErrorTypes_1 = require("../../infrastructure/errors/ErrorTypes");
const logger_1 = require("../../shared/utils/logger");
const ValidationError_1 = require("../../infrastructure/errors/ValidationError");
const DatabaseError_1 = require("../../infrastructure/errors/DatabaseError");
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
const errorHandler = (err, req, res, next) => {
    // Check for AuthError first (more specific)
    if (err instanceof AuthError_1.AuthError) {
        logger_1.Logger.warn(`Auth error: ${err.message}`, {
            subErrorType: err.subErrorType,
        });
        return ResponseFormatter_1.ResponseFormatter.error(res, {
            type: ErrorTypes_1.ErrorTypes.AuthenticationError,
            subErrorType: err.subErrorType,
            context: err.context,
            message: err.message,
        }, 401, err.message);
    }
    // Check for AppError (less specific)
    if (err instanceof AppError_1.AppError) {
        logger_1.Logger.warn(`App error: ${err.message}`, { context: err.context });
        return ResponseFormatter_1.ResponseFormatter.error(res, {
            type: ErrorTypes_1.ErrorTypes.ValidationError,
            context: err.context,
            message: err.message,
        }, 400, err.message);
    }
    if (err instanceof ValidationError_1.ValidationError) {
        return ResponseFormatter_1.ResponseFormatter.error(res, {
            type: ErrorTypes_1.ErrorTypes.ValidationError,
            message: err.message,
            details: err.details,
        }, 400, err.message);
    }
    if (err instanceof DatabaseError_1.DatabaseError) {
        logger_1.Logger.warn(`Database error: ${err.message}`, {
            details: err.details,
            hint: err.hint,
        });
        return ResponseFormatter_1.ResponseFormatter.error(res, {
            type: ErrorTypes_1.ErrorTypes.DatabaseError,
            message: err.message,
            details: err.details,
            hint: err.hint,
        }, err.status, err.message);
    }
    // Generic error
    logger_1.Logger.error("Internal server error", err);
    return ResponseFormatter_1.ResponseFormatter.error(res, {
        type: ErrorTypes_1.ErrorTypes.InternalServerError,
        message: err?.message || "An unexpected error occurred",
    }, 500, err?.message || "An unexpected error occurred");
};
exports.errorHandler = errorHandler;
