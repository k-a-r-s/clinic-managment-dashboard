import { AuthError } from "../../domain/errors/AuthError";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { Logger } from "../../shared/utils/logger";
import { LoginResponseDto } from "../dto/LoginResponseDto";

export class UserAuthService implements IUserAuthService {
   constructor(
      private userRepository: IUserRepository,
      private authRepository: IAuthRepository
   ) { }

   async loginUser(email: string, password: string): Promise<LoginResponseDto> {
      Logger.info("🔐 Login attempt", { email });

      const authResponse = await this.authRepository.login(email, password);

      // Get full user profile from database
      const profile = await this.userRepository.findByAuthUUID(authResponse.user.id);

      if (!profile) {
         Logger.error("❌ Profile not found", { userId: authResponse.user.id });
         throw new DatabaseError("User profile not found");
      }

      Logger.info("✅ Login successful", { email, userId: profile.getId(), role: profile.getRole() });

      return new LoginResponseDto(
         authResponse.access_token,
         authResponse.refresh_token,
         authResponse.expires_in || 3600,
         authResponse.token_type || 'Bearer',
         {
            id: profile.getId(),
            email: profile.getEmail(),
            firstName: profile.getFirstName(),
            lastName: profile.getLastName(),
            role: profile.getRole()
         }
      );
   }

   async signupUser(email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'doctor' | 'receptionist' = 'doctor') {

   }

   refreshToken(refreshToken: string) {
      // TODO: Implement refresh token logic
   }
}