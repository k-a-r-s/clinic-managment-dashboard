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
    async addUser(firstName, lastName, email, password, role) {
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
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'doctor');
        if (doctorsError) {
            logger_1.Logger.error('Failed to count doctors', { error: doctorsError });
            throw new DatabaseError_1.DatabaseError(doctorsError);
        }
        // Count receptionists
        const { count: receptionistsCount, error: receptionistsError } = await supabase_1.supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'receptionist');
        if (receptionistsError) {
            logger_1.Logger.error('Failed to count receptionists', { error: receptionistsError });
            throw new DatabaseError_1.DatabaseError(receptionistsError);
        }
        const doctors = doctorsCount || 0;
        const receptionists = receptionistsCount || 0;
        return { doctors, receptionists, total: doctors + receptionists };
    }
}
exports.UserRepository = UserRepository;
