"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.DatabaseErrorType = void 0;
const AppError_1 = require("./AppError");
var DatabaseErrorType;
(function (DatabaseErrorType) {
    DatabaseErrorType["INVALID_LOGIN_CREDENTIALS"] = "Invalid login credentials";
    DatabaseErrorType["USER_ALREADY_REGISTERED"] = "User already registered";
    DatabaseErrorType["PASSWORD_TOO_SHORT"] = "Password should be at least 6 characters";
    DatabaseErrorType["INVALID_TOKEN"] = "Invalid token";
    DatabaseErrorType["USER_NOT_CONFIRMED"] = "User not confirmed";
    DatabaseErrorType["RATE_LIMIT_EXCEEDED"] = "Too many requests";
})(DatabaseErrorType || (exports.DatabaseErrorType = DatabaseErrorType = {}));
class DatabaseError extends AppError_1.AppError {
    constructor(errorOrMessage, fallbackMessage) {
        const message = typeof errorOrMessage === "string"
            ? errorOrMessage
            : errorOrMessage?.message ||
                fallbackMessage ||
                "Database error occurred";
        super(message);
        this.status =
            typeof errorOrMessage === "string" ? 500 : errorOrMessage?.status || 500;
        this.details =
            typeof errorOrMessage === "string" ? undefined : errorOrMessage?.details;
        this.hint =
            typeof errorOrMessage === "string" ? undefined : errorOrMessage?.hint;
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, AppError_1.AppError.prototype);
    }
}
exports.DatabaseError = DatabaseError;
