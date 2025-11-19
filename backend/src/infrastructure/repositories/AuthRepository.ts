import { AuthError } from "../../domain/errors/AuthError";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { Logger } from "../../shared/utils/logger";
import { supabase } from "../database/supabase";

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

        const user = data.user;
        if (!user) {
            Logger.error("❌ User not found", { email });
            throw new DatabaseError("User not found");
        }

        const access_token = data.session?.access_token;
        const refresh_token = data.session?.refresh_token;
        const expires_in = data.session?.expires_in;
        const token_type = data.session?.token_type || 'Bearer';

        if (!access_token || !refresh_token) {
            Logger.error("❌ Missing tokens", { email, userId: user.id });
            throw AuthError.invalidToken();
        }
        return {
            user,
            access_token,
            refresh_token,
            expires_in,
            token_type
        };
    }
    async logout(authUUID: string): Promise<void> {
        // Implementation here
    }

    async refreshToken(refresh_token: string) {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token });
        return { data, error };
    }
}