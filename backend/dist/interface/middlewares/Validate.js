"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const ValidationError_1 = require("../../infrastructure/errors/ValidationError");
const logger_1 = require("../../shared/utils/logger");
/**
 * Validation middleware factory using Zod
 * @param schema - Zod schema to validate against
 * @returns Middleware function
 */
function validate(schema) {
    return async (req, res, next) => {
        try {
            logger_1.Logger.info("🔍 Starting validation", {
                endpoint: req.originalUrl,
                method: req.method,
            });
            // Parse and validate request body
            const result = schema.safeParse(req.body || {});
            if (!result.success) {
                // Format validation errors
                const validationDetails = result.error.issues.map((issue) => ({
                    field: issue.path.join(".") || "body",
                    type: issue.code,
                    message: issue.message,
                    received: "received" in issue ? JSON.stringify(issue.received) : "N/A",
                }));
                const errorMessage = result.error.issues
                    .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
                    .join("; ");
                logger_1.Logger.warn("❌ Validation failed", {
                    endpoint: req.originalUrl,
                    errors: validationDetails,
                });
                // Throw validation error (will be caught by error handler)
                throw new ValidationError_1.ValidationError(errorMessage, validationDetails);
            }
            // Attach validated data to request
            req.body = result.data;
            logger_1.Logger.info("✅ Validation passed", {
                endpoint: req.originalUrl,
            });
            next();
        }
        catch (error) {
            // Pass to error handler middleware
            next(error);
        }
    };
}
