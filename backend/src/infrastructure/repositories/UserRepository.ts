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
    role: "doctor" | "receptionist",
    phoneNumber?: string,
    salary?: number,
    specialization?: string,
    isMedicalDirector?: boolean
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
          phone_number: phoneNumber,
          salary: salary,
          specialization: specialization,
          is_medical_director: isMedicalDirector ?? false,
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
          phone_number: phoneNumber,
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

  async countStaff(): Promise<{
    doctors: number;
    receptionists: number;
    total: number;
  }> {
    // Count doctors
    const { count: doctorsCount, error: doctorsError } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "doctor");
    if (doctorsError) {
      Logger.error("Failed to count doctors", { error: doctorsError });
      throw new DatabaseError(doctorsError);
    }

    // Count receptionists
    const { count: receptionistsCount, error: receptionistsError } =
      await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "receptionist");
    if (receptionistsError) {
      Logger.error("Failed to count receptionists", {
        error: receptionistsError,
      });
      throw new DatabaseError(receptionistsError);
    }

    const doctors = doctorsCount || 0;
    const receptionists = receptionistsCount || 0;
    return { doctors, receptionists, total: doctors + receptionists };
  }

  async getAllUsers(roleFilter?: string): Promise<any[]> {
    try {
      Logger.debug("🔍 Fetching all users", { roleFilter });

      let query = supabaseAdmin
        .from("profiles")
        .select(
          `
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) {
        Logger.error("❌ Error fetching users", {
          error: profilesError.message,
        });
        throw new DatabaseError(profilesError);
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

      Logger.info(`✅ Found ${profiles.length} profiles`);

      // For each profile, get role-specific data
      const usersWithDetails = await Promise.all(
        profiles.map(async (profile: any) => {
          const baseUser = {
            id: profile.id,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            role: profile.role,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
            isActive: true, // Default to true if column doesn't exist
          };

          try {
            if (profile.role === "doctor") {
              const { data: doctorData } = await supabaseAdmin
                .from("doctors")
                .select(
                  "phone_number, salary, specialization, is_medical_director"
                )
                .eq("id", profile.id)
                .maybeSingle();

              if (doctorData) {
                return {
                  ...baseUser,
                  phoneNumber: doctorData.phone_number,
                  salary: doctorData.salary,
                  specialization: doctorData.specialization,
                  isMedicalDirector: doctorData.is_medical_director,
                };
              }
            } else if (profile.role === "receptionist") {
              const { data: receptionistData } = await supabaseAdmin
                .from("receptionists")
                .select("phone_number")
                .eq("id", profile.id)
                .maybeSingle();

              if (receptionistData) {
                return {
                  ...baseUser,
                  phoneNumber: receptionistData.phone_number,
                };
              }
            }
          } catch (roleError) {
            Logger.warn(
              `⚠️ Could not fetch role-specific data for ${profile.role}`,
              {
                userId: profile.id,
                error: roleError,
              }
            );
          }

          return baseUser;
        })
      );

      return usersWithDetails;
    } catch (error) {
      Logger.error("❌ Error in getAllUsers", { error });
      throw new DatabaseError(error as any);
    }
  }

  async getUserById(id: string): Promise<any | null> {
    try {
      Logger.debug("🔍 Fetching user by ID", { id });

      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select(
          `
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (profileError) {
        Logger.error("❌ Error fetching user", { error: profileError.message });
        throw new DatabaseError(profileError);
      }

      if (!profile) {
        Logger.warn("⚠️ User not found", { id });
        return null;
      }

      // Transform data
      const baseUser = {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        isActive: true, // Default to true if column doesn't exist
      };

      try {
        if (profile.role === "doctor") {
          const { data: doctorData } = await supabaseAdmin
            .from("doctors")
            .select("phone_number, salary, specialization, is_medical_director")
            .eq("id", id)
            .maybeSingle();

          if (doctorData) {
            return {
              ...baseUser,
              phoneNumber: doctorData.phone_number,
              salary: doctorData.salary,
              specialization: doctorData.specialization,
              isMedicalDirector: doctorData.is_medical_director,
            };
          }
        } else if (profile.role === "receptionist") {
          const { data: receptionistData } = await supabaseAdmin
            .from("receptionists")
            .select("phone_number")
            .eq("id", id)
            .maybeSingle();

          if (receptionistData) {
            return {
              ...baseUser,
              phoneNumber: receptionistData.phone_number,
            };
          }
        }
      } catch (roleError) {
        Logger.warn(
          `⚠️ Could not fetch role-specific data for ${profile.role}`,
          {
            userId: id,
            error: roleError,
          }
        );
      }

      return baseUser;
    } catch (error) {
      Logger.error("❌ Error in getUserById", { error });
      throw new DatabaseError(error as any);
    }
  }

  async updateUser(id: string, updateData: any): Promise<any> {
    try {
      Logger.info("🔄 Updating user", { id, updateData });

      // First, get the user to know their role
      const user = await this.getUserById(id);
      if (!user) {
        throw new DatabaseError({ message: "User not found" });
      }

      Logger.info("📋 Current user data", { user });

      // Update profiles table
      const profileUpdate: any = {};
      if (updateData.firstName) profileUpdate.first_name = updateData.firstName;
      if (updateData.lastName) profileUpdate.last_name = updateData.lastName;
      if (updateData.email) profileUpdate.email = updateData.email;

      if (Object.keys(profileUpdate).length > 0) {
        profileUpdate.updated_at = new Date().toISOString();
        Logger.info("📝 Updating profile with", { profileUpdate });
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update(profileUpdate)
          .eq("id", id);

        if (profileError) {
          Logger.error("❌ Error updating profile", {
            error: profileError.message,
          });
          throw new DatabaseError(profileError);
        }
        Logger.info("✅ Profile updated successfully");
      }

      // Update role-specific table
      if (user.role === "doctor") {
        const doctorUpdate: any = {};
        if (updateData.phoneNumber !== undefined)
          doctorUpdate.phone_number = updateData.phoneNumber;
        if (updateData.salary !== undefined)
          doctorUpdate.salary = updateData.salary;
        if (updateData.specialization !== undefined)
          doctorUpdate.specialization = updateData.specialization;
        if (updateData.isMedicalDirector !== undefined)
          doctorUpdate.is_medical_director = updateData.isMedicalDirector;

        if (Object.keys(doctorUpdate).length > 0) {
          doctorUpdate.updated_at = new Date().toISOString();
          Logger.info("📝 Updating doctor with", { doctorUpdate });
          const { error: doctorError } = await supabaseAdmin
            .from("doctors")
            .update(doctorUpdate)
            .eq("id", id);

          if (doctorError) {
            Logger.error("❌ Error updating doctor", {
              error: doctorError.message,
            });
            throw new DatabaseError(doctorError);
          }
          Logger.info("✅ Doctor info updated successfully");
        }
      } else if (user.role === "receptionist") {
        if (updateData.phoneNumber !== undefined) {
          Logger.info("📝 Updating receptionist with", {
            phone_number: updateData.phoneNumber,
          });
          const { error: receptionistError } = await supabaseAdmin
            .from("receptionists")
            .update({
              phone_number: updateData.phoneNumber,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id);

          if (receptionistError) {
            Logger.error("❌ Error updating receptionist", {
              error: receptionistError.message,
            });
            throw new DatabaseError(receptionistError);
          }
          Logger.info("✅ Receptionist info updated successfully");
        }
      }

      Logger.info("✅ User updated successfully", { id });

      // Return updated user
      return await this.getUserById(id);
    } catch (error) {
      Logger.error("❌ Error in updateUser", { error });
      throw new DatabaseError(error as any);
    }
  }

  async softDeleteUser(id: string): Promise<void> {
    try {
      Logger.debug("🗑️ Deleting user", { id });

      // Get user role first
      const user = await this.getUserById(id);
      if (!user) {
        throw new DatabaseError({ message: "User not found" });
      }

      // Delete from role-specific table first
      if (user.role === "doctor") {
        const { error: doctorError } = await supabaseAdmin
          .from("doctors")
          .delete()
          .eq("id", id);

        if (doctorError) {
          Logger.error("❌ Error deleting doctor record", {
            error: doctorError.message,
          });
          throw new DatabaseError(doctorError);
        }
      } else if (user.role === "receptionist") {
        const { error: receptionistError } = await supabaseAdmin
          .from("receptionists")
          .delete()
          .eq("id", id);

        if (receptionistError) {
          Logger.error("❌ Error deleting receptionist record", {
            error: receptionistError.message,
          });
          throw new DatabaseError(receptionistError);
        }
      }

      // Delete from profiles table
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", id);

      if (profileError) {
        Logger.error("❌ Error deleting user profile", {
          error: profileError.message,
        });
        throw new DatabaseError(profileError);
      }

      // Delete from auth
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        id
      );

      if (authError) {
        Logger.error("❌ Error deleting user from auth", {
          error: authError.message,
        });
        // Don't throw - profile is already deleted
      }

      Logger.info("✅ User deleted successfully", { id });
    } catch (error) {
      Logger.error("❌ Error in softDeleteUser", { error });
      throw new DatabaseError(error as any);
    }
  }
}
