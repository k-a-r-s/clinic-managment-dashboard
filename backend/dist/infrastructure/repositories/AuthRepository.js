"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const DatabaseError_1 = require("../errors/DatabaseError");
const logger_1 = require("../../shared/utils/logger");
const supabase_1 = require("../database/supabase");
const User_1 = require("../../domain/entities/User");
class AuthRepository {
    async login(email, password) {
        const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
            email: email, // ✅ Use the parameter
            password: password, // ✅ Use the parameter
        });
        if (error) {
            logger_1.Logger.error("❌ Login failed", { email, error: error.message });
            throw new DatabaseError_1.DatabaseError(error);
        }
        const supabaseUser = data.user;
        if (!supabaseUser) {
            logger_1.Logger.error("❌ User not found", { email });
            throw new DatabaseError_1.DatabaseError("User not found");
        }
        // Map Supabase User to your domain User
        const user = new User_1.User(supabaseUser.id, supabaseUser.email || "", supabaseUser.user_metadata?.first_name || "", // ✅ snake_case
        supabaseUser.user_metadata?.last_name || "", // ✅ snake_case
        supabaseUser.user_metadata?.role || "doctor" // ✅ Match what you stored
        );
        const access_token = data.session?.access_token;
        const refresh_token = data.session?.refresh_token;
        const expires_in = data.session?.expires_in ?? 0;
        const token_type = data.session?.token_type || "Bearer";
        if (!access_token || !refresh_token) {
            logger_1.Logger.error("❌ Tokens not found");
            throw new DatabaseError_1.DatabaseError("Tokens not found");
        }
        logger_1.Logger.info("✅ Login successful", { email, userId: supabaseUser.id });
        return {
            access_token,
            refresh_token,
            expires_in,
            token_type,
            user,
        };
    }
    async logout(accessToken) {
        try {
            logger_1.Logger.info("🔐 Logout attempt");
            // Supabase handles session invalidation when client deletes tokens
            // This is a server-side acknowledgment
            logger_1.Logger.info("✅ User logged out successfully");
        }
        catch (error) {
            logger_1.Logger.error("❌ Logout error", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async refreshToken(refreshToken) {
        const { data, error } = await supabase_1.supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            logger_1.Logger.error("❌ Refresh token failed", { error: error.message });
            throw new DatabaseError_1.DatabaseError(error);
        }
        const supabaseUser = data.session?.user;
        if (!supabaseUser) {
            logger_1.Logger.error("❌ User not found during token refresh");
            throw new DatabaseError_1.DatabaseError("User not found");
        }
        // Map Supabase User to your domain User
        const user = new User_1.User(supabaseUser.id, supabaseUser.email || "", supabaseUser.user_metadata?.first_name || "", // ✅ snake_case
        supabaseUser.user_metadata?.last_name || "", // ✅ snake_case
        supabaseUser.user_metadata?.role || "doctor" // ✅ Match what you stored
        );
        const access_token = data.session?.access_token;
        const refresh_token = data.session?.refresh_token;
        const expires_in = data.session?.expires_in;
        const token_type = data.session?.token_type || "Bearer";
        if (!access_token || !refresh_token) {
            logger_1.Logger.error("❌ Tokens not found during refresh");
            throw new DatabaseError_1.DatabaseError("Tokens not found");
        }
        return {
            access_token,
            refresh_token,
            expires_in: expires_in || 0,
            token_type,
            user,
        };
    }
}
exports.AuthRepository = AuthRepository;
