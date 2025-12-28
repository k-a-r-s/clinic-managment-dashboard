"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const AuthError_1 = require("../../infrastructure/errors/AuthError");
const logger_1 = require("../../shared/utils/logger");
// Role-based access control middleware
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            const err = AuthError_1.AuthError.invalidToken("User not authenticated");
            return next(err);
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                status: 403,
                data: null,
                error: {
                    message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
                },
            });
        }
        logger_1.Logger.info(`User ${req.user.id} authorized for role: ${req.user.role}`);
        next();
    };
};
exports.requireRole = requireRole;
