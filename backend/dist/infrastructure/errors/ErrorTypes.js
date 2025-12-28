"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTypes = void 0;
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["ValidationError"] = "ValidationError";
    ErrorTypes["NotFoundError"] = "NotFoundError";
    ErrorTypes["ConflictError"] = "ConflictError";
    ErrorTypes["UnauthorizedError"] = "UnauthorizedError";
    ErrorTypes["ForbiddenError"] = "ForbiddenError";
    ErrorTypes["InternalServerError"] = "InternalServerError";
    ErrorTypes["AuthenticationError"] = "AuthenticationError";
    ErrorTypes["AppError"] = "AppError";
    ErrorTypes["DatabaseError"] = "DatabaseError";
})(ErrorTypes || (exports.ErrorTypes = ErrorTypes = {}));
