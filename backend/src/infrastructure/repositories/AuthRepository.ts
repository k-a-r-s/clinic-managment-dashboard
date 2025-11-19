import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { supabase } from "../database/supabase";

export class AuthRepository implements IAuthRepository {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
       
        return { data, error };
    }
    async logout(authUUID: string): Promise<void> {
        // Implementation here
    }

    async refreshToken(refresh_token: string) {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token });
        return { data, error };
    }
}