import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { supabase } from "../database/supabase";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { Logger } from "../../shared/utils/logger";

export class UserRepository implements IUserRepository {

    /**
     * Find user by Supabase Auth UUID (using new profiles table schema)
     */
    async findByAuthUUID(authUUID: string): Promise<User | null> {
        try {
            Logger.debug("🔍 Finding user by auth UUID", { authUUID });

            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    email,
                    first_name,
                    last_name,
                    role,
                    created_at,
                    updated_at
                `)
                .eq('id', authUUID)
                .single();

            if (error) {
                Logger.warn("⚠️ User profile not found", { authUUID, error: error.message });
                return null;
            }

            if (!data) {
                Logger.debug("📭 No profile found", { authUUID });
                return null;
            }

            Logger.debug("✅ User profile found", { authUUID, userId: data.id });

            // Convert to domain entity
            return User.fromDataBase({
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role
            });
        } catch (error) {
            Logger.error("❌ Error finding user by auth UUID", { authUUID, error });
            throw new DatabaseError(error as any);
        }
    }

   

}