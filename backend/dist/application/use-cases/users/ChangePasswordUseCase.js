"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordUseCase = void 0;
const ValidationError_1 = require("../../../infrastructure/errors/ValidationError");
const supabase_1 = require("../../../infrastructure/database/supabase");
class ChangePasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, currentPassword, newPassword) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new ValidationError_1.ValidationError("User not found");
        }
        // Get password hash from auth.users table
        const { data: authUser, error } = await supabase_1.supabaseAdmin.auth.admin.getUserById(userId);
        if (error || !authUser?.user) {
            throw new ValidationError_1.ValidationError("Unable to verify password");
        }
        // For Supabase Auth, we need to verify the password differently
        // Try to sign in with the current password to verify it
        const { error: signInError } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });
        if (signInError) {
            throw new ValidationError_1.ValidationError("Current password is incorrect");
        }
        // Update password using Supabase Auth API
        const { error: updateError } = await supabase_1.supabaseAdmin.auth.admin.updateUserById(userId, {
            password: newPassword,
        });
        if (updateError) {
            throw new ValidationError_1.ValidationError("Failed to update password");
        }
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
