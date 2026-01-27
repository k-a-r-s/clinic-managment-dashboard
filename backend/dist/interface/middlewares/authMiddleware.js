"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const AuthError_1 = require("../../infrastructure/errors/AuthError");
const supabase_1 = require("../../infrastructure/database/supabase");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const logger_1 = require("../../shared/utils/logger");
const authMiddleware = async (req, res, next) => {
    try {
        let token;
        // 1. Check for token in cookies first (preferred method)
        token = req.cookies?.accessToken;
        // 2. Fall back to Authorization header for backward compatibility
        if (!token) {
            const authHeader = req.headers["authorization"];
            if (authHeader) {
                const parts = authHeader.split(" ");
                if (parts.length === 2 && parts[0] === "Bearer") {
                    token = parts[1];
                }
            }
        }
        // 3. If no token found in either location, reject request
        if (!token) {
            const err = AuthError_1.AuthError.invalidToken("No access token provided in cookies or authorization header");
            return next(err);
        }
        // 3. ✅ Verify token with Supabase admin client
        const { data: { user }, error, } = await supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !user) {
            logger_1.Logger.error("🔴 Token verification failed", {
                error: error?.message,
                token: token.substring(0, 20) + "...",
            });
            const err = AuthError_1.AuthError.invalidToken("Invalid or expired token");
            return next(err);
        }
        logger_1.Logger.debug("✅ Token verified", { userId: user.id });
        // 4. Get user profile from database using repository
        const userRepository = new UserRepository_1.UserRepository();
        const userProfile = await userRepository.findByAuthUUID(user.id);
        if (!userProfile) {
            logger_1.Logger.error("🔴 User profile not found in database", {
                userId: user.id,
            });
            const err = AuthError_1.AuthError.invalidToken("User profile not found");
            return next(err);
        }
        // 5. Attach user to request
        req.user = {
            id: userProfile.getId(),
            email: userProfile.getEmail(),
            firstName: userProfile.getFirstName(),
            lastName: userProfile.getLastName(),
            role: userProfile.getRole(),
            token: token,
        };
        logger_1.Logger.info(`✅ User authenticated: ${req.user.id} (role: ${req.user.role})`);
        next();
    }
    catch (error) {
        logger_1.Logger.error("🔴 Auth middleware error", { error });
        const err = AuthError_1.AuthError.invalidToken("Authentication failed");
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
