import { AuthError } from "../../infrastructure/errors/AuthError";
import { AppError } from "../../infrastructure/errors/AppError";
import { ErrorTypes } from "../../infrastructure/errors/ErrorTypes";
import { Logger } from "../../shared/utils/logger";
import { ValidationError } from "../../infrastructure/errors/ValidationError";
import { DatabaseError } from "../../infrastructure/errors/DatabaseError";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  // Check for AuthError first (more specific)
  if (err instanceof AuthError) {
    Logger.warn(`Auth error: ${err.message}`, {
      subErrorType: err.subErrorType,
    });
    return ResponseFormatter.error(
      res,
      {
        type: ErrorTypes.AuthenticationError,
        subErrorType: err.subErrorType,
        context: err.context,
        message: err.message,
      },
      401,
      err.message
    );
  }

  // Check for AppError (less specific)
  if (err instanceof AppError) {
    Logger.warn(`App error: ${err.message}`, { context: err.context });
    return ResponseFormatter.error(
      res,
      {
        type: ErrorTypes.ValidationError,
        context: err.context,
        message: err.message,
      },
      400,
      err.message
    );
  }
  
  if (err instanceof ValidationError) {
    return ResponseFormatter.error(
      res,
      {
        type: ErrorTypes.ValidationError,
        message: err.message,
        details: err.details,
      },
      400,
      err.message
    );
  }
  
  if (err instanceof DatabaseError) {
    Logger.warn(`Database error: ${err.message}`, {
      details: err.details,
      hint: err.hint,
    });
    return ResponseFormatter.error(
      res,
      {
        type: ErrorTypes.DatabaseError,
        message: err.message,
        details: err.details,
        hint: err.hint,
      },
      err.status,
      err.message
    );
  }

  // Generic error
  Logger.error("Internal server error", err);
  return ResponseFormatter.error(
    res,
    {
      type: ErrorTypes.InternalServerError,
      message: err?.message || "An unexpected error occurred",
    },
    500,
    err?.message || "An unexpected error occurred"
  );
};
