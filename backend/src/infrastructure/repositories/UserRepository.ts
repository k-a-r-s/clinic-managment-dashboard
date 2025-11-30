import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { supabase, supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { Logger } from "../../shared/utils/logger";

export class UserRepository implements IUserRepository {
  /**
   * Find user by Supabase Auth UUID (using new profiles table schema)
   */
  async findByAuthUUID(authUUID: string): Promise<User | null> {
    try {
      Logger.debug("🔍 Finding user by auth UUID", { authUUID });

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role")
        .eq("id", authUUID)
        .maybeSingle(); // ✅ Use maybeSingle() instead of single()

      if (error) {
        Logger.warn("⚠️ User profile not found", {
          authUUID,
          error: error.message,
        });
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
        role: data.role,
      });
    } catch (error) {
      Logger.error("❌ Error finding user by auth UUID", { authUUID, error });
      throw new DatabaseError(error as any);
    }
  }

  async addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: "doctor" | "receptionist"
  ): Promise<User> {
    const { data: AuthData, error: AuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role,
        },
      });
    if (AuthError) {
      Logger.error("❌ User creation failed", { error: AuthError.message });
      throw new DatabaseError(AuthError);
    }
    Logger.info("✅ auth User created successfully", { email });
    const { data: ProfileData, error: ProfileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: AuthData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      });
    if (ProfileError) {
      Logger.error("❌ User creation failed", { error: ProfileError.message });
      throw new DatabaseError(ProfileError);
    }
    Logger.info("✅ profile created successfully", { email });
    if (role === "doctor") {
      const { error: DoctorError } = await supabaseAdmin
        .from("doctors")
        .insert({
          id: AuthData.user.id,
        });
      if (DoctorError) {
        Logger.error("❌ User creation failed", { error: DoctorError.message });
        throw new DatabaseError(DoctorError);
      }
      Logger.info("✅ doctor created successfully", { email });
    }
    if (role === "receptionist") {
      const { error: ReceptionistError } = await supabaseAdmin
        .from("receptionists")
        .insert({
          id: AuthData.user.id,
        });
      if (ReceptionistError) {
        Logger.error("❌ User creation failed", {
          error: ReceptionistError.message,
        });
        throw new DatabaseError(ReceptionistError);
      }
      Logger.info("✅ receptionist created successfully", { email });
    }
    return new User(AuthData.user.id, email, firstName, lastName, role);
  }
}
