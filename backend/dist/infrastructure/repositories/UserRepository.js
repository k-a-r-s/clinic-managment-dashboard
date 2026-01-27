"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const supabase_1 = require("../database/supabase");
const DatabaseError_1 = require("../errors/DatabaseError");
const logger_1 = require("../../shared/utils/logger");
class UserRepository {
    /**
     * Find user by Supabase Auth UUID (using new profiles table schema)
     */
    async findByAuthUUID(authUUID) {
        try {
            logger_1.Logger.debug("🔍 Finding user by auth UUID", { authUUID });
            const { data, error } = await supabase_1.supabase
                .from("profiles")
                .select("id, email, first_name, last_name, role")
                .eq("id", authUUID)
                .maybeSingle(); // ✅ Use maybeSingle() instead of single()
            if (error) {
                logger_1.Logger.warn("⚠️ User profile not found", {
                    authUUID,
                    error: error.message,
                });
                return null;
            }
            if (!data) {
                logger_1.Logger.debug("📭 No profile found", { authUUID });
                return null;
            }
            logger_1.Logger.debug("✅ User profile found", { authUUID, userId: data.id });
            // Convert to domain entity
            return User_1.User.fromDataBase({
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role,
            });
        }
        catch (error) {
            logger_1.Logger.error("❌ Error finding user by auth UUID", { authUUID, error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async addUser(firstName, lastName, email, password, role, phoneNumber, salary, specialization, isMedicalDirector) {
        const { data: AuthData, error: AuthError } = await supabase_1.supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                role,
            },
        });
        if (AuthError) {
            logger_1.Logger.error("❌ User creation failed", { error: AuthError.message });
            throw new DatabaseError_1.DatabaseError(AuthError);
        }
        logger_1.Logger.info("✅ auth User created successfully", { email });
        const { data: ProfileData, error: ProfileError } = await supabase_1.supabaseAdmin
            .from("profiles")
            .insert({
            id: AuthData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role,
        });
        if (ProfileError) {
            logger_1.Logger.error("❌ User creation failed", { error: ProfileError.message });
            throw new DatabaseError_1.DatabaseError(ProfileError);
        }
        logger_1.Logger.info("✅ profile created successfully", { email });
        if (role === "doctor") {
            const { error: DoctorError } = await supabase_1.supabaseAdmin
                .from("doctors")
                .insert({
                id: AuthData.user.id,
                phone_number: phoneNumber,
                salary: salary,
                specialization: specialization,
                is_medical_director: isMedicalDirector ?? false,
            });
            if (DoctorError) {
                logger_1.Logger.error("❌ User creation failed", { error: DoctorError.message });
                throw new DatabaseError_1.DatabaseError(DoctorError);
            }
            logger_1.Logger.info("✅ doctor created successfully", { email });
        }
        if (role === "receptionist") {
            const { error: ReceptionistError } = await supabase_1.supabaseAdmin
                .from("receptionists")
                .insert({
                id: AuthData.user.id,
                phone_number: phoneNumber,
            });
            if (ReceptionistError) {
                logger_1.Logger.error("❌ User creation failed", {
                    error: ReceptionistError.message,
                });
                throw new DatabaseError_1.DatabaseError(ReceptionistError);
            }
            logger_1.Logger.info("✅ receptionist created successfully", { email });
        }
        return new User_1.User(AuthData.user.id, email, firstName, lastName, role);
    }
    async countStaff() {
        // Count doctors
        const { count: doctorsCount, error: doctorsError } = await supabase_1.supabaseAdmin
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "doctor");
        if (doctorsError) {
            logger_1.Logger.error("Failed to count doctors", { error: doctorsError });
            throw new DatabaseError_1.DatabaseError(doctorsError);
        }
        // Count receptionists
        const { count: receptionistsCount, error: receptionistsError } = await supabase_1.supabaseAdmin
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "receptionist");
        if (receptionistsError) {
            logger_1.Logger.error("Failed to count receptionists", {
                error: receptionistsError,
            });
            throw new DatabaseError_1.DatabaseError(receptionistsError);
        }
        const doctors = doctorsCount || 0;
        const receptionists = receptionistsCount || 0;
        return { doctors, receptionists, total: doctors + receptionists };
    }
    async getAllUsers(roleFilter) {
        try {
            logger_1.Logger.debug("🔍 Fetching all users", { roleFilter });
            let query = supabase_1.supabaseAdmin
                .from("profiles")
                .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `)
                .order("created_at", { ascending: false });
            if (roleFilter) {
                query = query.eq("role", roleFilter);
            }
            const { data: profiles, error: profilesError } = await query;
            if (profilesError) {
                logger_1.Logger.error("❌ Error fetching users", {
                    error: profilesError.message,
                });
                throw new DatabaseError_1.DatabaseError(profilesError);
            }
            if (!profiles || profiles.length === 0) {
                return [];
            }
            logger_1.Logger.info(`✅ Found ${profiles.length} profiles`);
            // For each profile, get role-specific data
            const usersWithDetails = await Promise.all(profiles.map(async (profile) => {
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
                        const { data: doctorData } = await supabase_1.supabaseAdmin
                            .from("doctors")
                            .select("phone_number, salary, specialization, is_medical_director")
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
                    }
                    else if (profile.role === "receptionist") {
                        const { data: receptionistData } = await supabase_1.supabaseAdmin
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
                }
                catch (roleError) {
                    logger_1.Logger.warn(`⚠️ Could not fetch role-specific data for ${profile.role}`, {
                        userId: profile.id,
                        error: roleError,
                    });
                }
                return baseUser;
            }));
            return usersWithDetails;
        }
        catch (error) {
            logger_1.Logger.error("❌ Error in getAllUsers", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async getUserById(id) {
        try {
            logger_1.Logger.debug("🔍 Fetching user by ID", { id });
            const { data: profile, error: profileError } = await supabase_1.supabaseAdmin
                .from("profiles")
                .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at
        `)
                .eq("id", id)
                .maybeSingle();
            if (profileError) {
                logger_1.Logger.error("❌ Error fetching user", { error: profileError.message });
                throw new DatabaseError_1.DatabaseError(profileError);
            }
            if (!profile) {
                logger_1.Logger.warn("⚠️ User not found", { id });
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
                    const { data: doctorData } = await supabase_1.supabaseAdmin
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
                }
                else if (profile.role === "receptionist") {
                    const { data: receptionistData } = await supabase_1.supabaseAdmin
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
            }
            catch (roleError) {
                logger_1.Logger.warn(`⚠️ Could not fetch role-specific data for ${profile.role}`, {
                    userId: id,
                    error: roleError,
                });
            }
            return baseUser;
        }
        catch (error) {
            logger_1.Logger.error("❌ Error in getUserById", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async updateUser(id, updateData) {
        try {
            logger_1.Logger.info("🔄 Updating user", { id, updateData });
            // First, get the user to know their role
            const user = await this.getUserById(id);
            if (!user) {
                throw new DatabaseError_1.DatabaseError({ message: "User not found" });
            }
            logger_1.Logger.info("📋 Current user data", { user });
            // Update profiles table
            const profileUpdate = {};
            if (updateData.firstName)
                profileUpdate.first_name = updateData.firstName;
            if (updateData.lastName)
                profileUpdate.last_name = updateData.lastName;
            if (updateData.email)
                profileUpdate.email = updateData.email;
            if (Object.keys(profileUpdate).length > 0) {
                profileUpdate.updated_at = new Date().toISOString();
                logger_1.Logger.info("📝 Updating profile with", { profileUpdate });
                const { error: profileError } = await supabase_1.supabaseAdmin
                    .from("profiles")
                    .update(profileUpdate)
                    .eq("id", id);
                if (profileError) {
                    logger_1.Logger.error("❌ Error updating profile", {
                        error: profileError.message,
                    });
                    throw new DatabaseError_1.DatabaseError(profileError);
                }
                logger_1.Logger.info("✅ Profile updated successfully");
            }
            // Update role-specific table
            if (user.role === "doctor") {
                const doctorUpdate = {};
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
                    logger_1.Logger.info("📝 Updating doctor with", { doctorUpdate });
                    const { error: doctorError } = await supabase_1.supabaseAdmin
                        .from("doctors")
                        .update(doctorUpdate)
                        .eq("id", id);
                    if (doctorError) {
                        logger_1.Logger.error("❌ Error updating doctor", {
                            error: doctorError.message,
                        });
                        throw new DatabaseError_1.DatabaseError(doctorError);
                    }
                    logger_1.Logger.info("✅ Doctor info updated successfully");
                }
            }
            else if (user.role === "receptionist") {
                if (updateData.phoneNumber !== undefined) {
                    logger_1.Logger.info("📝 Updating receptionist with", {
                        phone_number: updateData.phoneNumber,
                    });
                    const { error: receptionistError } = await supabase_1.supabaseAdmin
                        .from("receptionists")
                        .update({
                        phone_number: updateData.phoneNumber,
                        updated_at: new Date().toISOString(),
                    })
                        .eq("id", id);
                    if (receptionistError) {
                        logger_1.Logger.error("❌ Error updating receptionist", {
                            error: receptionistError.message,
                        });
                        throw new DatabaseError_1.DatabaseError(receptionistError);
                    }
                    logger_1.Logger.info("✅ Receptionist info updated successfully");
                }
            }
            logger_1.Logger.info("✅ User updated successfully", { id });
            // Return updated user
            return await this.getUserById(id);
        }
        catch (error) {
            logger_1.Logger.error("❌ Error in updateUser", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async softDeleteUser(id) {
        try {
            logger_1.Logger.debug("🗑️ Deleting user", { id });
            // Get user role first
            const user = await this.getUserById(id);
            if (!user) {
                throw new DatabaseError_1.DatabaseError({ message: "User not found" });
            }
            // Delete from role-specific table first
            if (user.role === "doctor") {
                const { error: doctorError } = await supabase_1.supabaseAdmin
                    .from("doctors")
                    .delete()
                    .eq("id", id);
                if (doctorError) {
                    logger_1.Logger.error("❌ Error deleting doctor record", {
                        error: doctorError.message,
                    });
                    throw new DatabaseError_1.DatabaseError(doctorError);
                }
            }
            else if (user.role === "receptionist") {
                const { error: receptionistError } = await supabase_1.supabaseAdmin
                    .from("receptionists")
                    .delete()
                    .eq("id", id);
                if (receptionistError) {
                    logger_1.Logger.error("❌ Error deleting receptionist record", {
                        error: receptionistError.message,
                    });
                    throw new DatabaseError_1.DatabaseError(receptionistError);
                }
            }
            // Delete from profiles table
            const { error: profileError } = await supabase_1.supabaseAdmin
                .from("profiles")
                .delete()
                .eq("id", id);
            if (profileError) {
                logger_1.Logger.error("❌ Error deleting user profile", {
                    error: profileError.message,
                });
                throw new DatabaseError_1.DatabaseError(profileError);
            }
            // Delete from auth
            const { error: authError } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(id);
            if (authError) {
                logger_1.Logger.error("❌ Error deleting user from auth", {
                    error: authError.message,
                });
                // Don't throw - profile is already deleted
            }
            logger_1.Logger.info("✅ User deleted successfully", { id });
        }
        catch (error) {
            logger_1.Logger.error("❌ Error in softDeleteUser", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
}
exports.UserRepository = UserRepository;
