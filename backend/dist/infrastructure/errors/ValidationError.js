"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const AppError_1 = require("./AppError");
class ValidationError extends AppError_1.AppError {
    constructor(message = "Validation error occurred", details = []) {
        super(message, {
            userMessage: "There was a validation error. Please check your input and try again.",
            statusCode: 400,
        });
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.details = details;
    }
    getTitle() {
        return "Validation Error";
    }
}
exports.ValidationError = ValidationError;
