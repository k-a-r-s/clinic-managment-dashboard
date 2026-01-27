"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
const AppError_1 = require("./AppError");
var AuthErrorType;
(function (AuthErrorType) {
    AuthErrorType["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthErrorType["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthErrorType["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
    AuthErrorType["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthErrorType["INVALID_TOKEN"] = "INVALID_TOKEN";
    AuthErrorType["UNAUTHORIZED"] = "UNAUTHORIZED";
    AuthErrorType["FORBIDDEN"] = "FORBIDDEN";
    AuthErrorType["PASSWORD_MISMATCH"] = "PASSWORD_MISMATCH";
    AuthErrorType["EMAIL_NOT_VERIFIED"] = "EMAIL_NOT_VERIFIED";
    AuthErrorType["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
})(AuthErrorType || (AuthErrorType = {}));
class AuthError extends AppError_1.AppError {
    constructor(message, context, subErrorType) {
        super(message, context);
        this.subErrorType = subErrorType;
        // Maintain proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, AuthError.prototype);
    }
    static invalidCredentials(context) {
        return new AuthError("Invalid credentials provided.", context, AuthErrorType.INVALID_CREDENTIALS);
    }
    static userNotFound(context) {
        return new AuthError("User not found.", context, AuthErrorType.USER_NOT_FOUND);
    }
    static userAlreadyExists(context) {
        return new AuthError("User already exists.", context, AuthErrorType.USER_ALREADY_EXISTS);
    }
    static tokenExpired(context) {
        return new AuthError("Authentication token has expired.", context, AuthErrorType.TOKEN_EXPIRED);
    }
    static invalidToken(context) {
        return new AuthError("Invalid authentication token.", context, AuthErrorType.INVALID_TOKEN);
    }
    static unauthorized(context) {
        return new AuthError("Unauthorized access.", context, AuthErrorType.UNAUTHORIZED);
    }
    static forbidden(context) {
        return new AuthError("Forbidden access.", context, AuthErrorType.FORBIDDEN);
    }
    static passwordMismatch(context) {
        return new AuthError("Password does not match.", context, AuthErrorType.PASSWORD_MISMATCH);
    }
    static emailNotVerified(context) {
        return new AuthError("Email address is not verified.", context, AuthErrorType.EMAIL_NOT_VERIFIED);
    }
    static accountLocked(context) {
        return new AuthError("Account is locked.", context, AuthErrorType.ACCOUNT_LOCKED);
    }
}
exports.AuthError = AuthError;
