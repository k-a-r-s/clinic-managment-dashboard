import { AuthError } from "../../domain/errors/AuthError";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { Logger } from "../../shared/utils/logger";
import { supabase, supabaseAdmin } from "../database/supabase";
import { User } from "../../domain/entities/User";

export class AuthRepository implements IAuthRepository {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            Logger.error("❌ Login failed", { email, error: error.message });
            throw new DatabaseError(error);
        }

        const supabaseUser = data.user;
        if (!supabaseUser) {
            Logger.error("❌ User not found", { email });
            throw new DatabaseError("User not found");
        }

        // Map Supabase User to your domain User
        const user = new User(
            supabaseUser.id,
            supabaseUser.email || "",
            supabaseUser.user_metadata?.firstName || "",
            supabaseUser.user_metadata?.lastName || "",
            supabaseUser.user_metadata?.role || "user"
        );

        const access_token = data.session?.access_token;
        const refresh_token = data.session?.refresh_token;
        const expires_in = data.session?.expires_in;
        const token_type = data.session?.token_type || 'Bearer';

        if (!access_token || !refresh_token) {
            Logger.error("❌ Tokens not found");
            throw new DatabaseError("Tokens not found");
        }

        return {
            access_token,
            refresh_token,
            expires_in,
            token_type,
            user
        };
    }
    async logout(accessToken: string): Promise<void> {
        try {
            Logger.info("🔐 Logout attempt");

            // Supabase handles session invalidation when client deletes tokens
            // This is a server-side acknowledgment
            Logger.info("✅ User logged out successfully");
        } catch (error) {
            Logger.error("❌ Logout error", { error });
            throw new DatabaseError(error as any);
        }
    }
    async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_in: number; token_type: string; user: User; }> {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            Logger.error("❌ Refresh token failed", { refreshToken, error: error.message });
            throw new DatabaseError(error);
        }

        const supabaseUser = data.session?.user;
        if (!supabaseUser) {
            Logger.error("❌ User not found during token refresh", { refreshToken });
            throw new DatabaseError("User not found");
        }

        // Map Supabase User to your domain User
        const user = new User(
            supabaseUser.id,
            supabaseUser.email || "",
            supabaseUser.user_metadata?.firstName || "",
            supabaseUser.user_metadata?.lastName || "",
            supabaseUser.user_metadata?.role || "user"
        );

        const access_token = data.session?.access_token;
        const refresh_token = data.session?.refresh_token;
        const expires_in = data.session?.expires_in;
        const token_type = data.session?.token_type || 'Bearer';

        if (!access_token || !refresh_token) {
            Logger.error("❌ Tokens not found during refresh");
            throw new DatabaseError("Tokens not found");
        }

        return {
            access_token,
            refresh_token,
            expires_in,
            token_type,
            user
        };

    }
}