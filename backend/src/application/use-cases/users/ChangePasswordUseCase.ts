import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ValidationError } from "../../../infrastructure/errors/ValidationError";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../../../infrastructure/database/supabase";

export class ChangePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new ValidationError("User not found");
    }

    // Get password hash from auth.users table
    const { data: authUser, error } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !authUser?.user) {
      throw new ValidationError("Unable to verify password");
    }

    // For Supabase Auth, we need to verify the password differently
    // Try to sign in with the current password to verify it
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new ValidationError("Current password is incorrect");
    }

    // Update password using Supabase Auth API
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

    if (updateError) {
      throw new ValidationError("Failed to update password");
    }
  }
}
