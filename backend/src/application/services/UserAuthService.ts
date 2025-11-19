import { AuthError } from "../../domain/errors/AuthError";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { Logger } from "../../shared/utils/logger";

export class UserAuthService implements IUserAuthService {
   constructor(
      private userRepository: IUserRepository,
      private authRepository: IAuthRepository
   ) { }

   async loginUser(email: string, password: string) {
      try {
         Logger.info("🔐 Login attempt", { email });

         const { data, error } = await this.authRepository.login(email, password);

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

         if (!access_token || !refresh_token) {
            Logger.error("❌ Missing tokens", { email, userId: user.id });
            throw AuthError.invalidToken();
         }

         Logger.info("✅ Login successful", { email, userId: user.id });
         return access_token;
      } catch (error) {
         Logger.error("❌ Login exception", { email, error: (error as any).message });
         throw error;
      }
   }

   refreshToken(refreshToken: string) {
      // TODO: Implement refresh token logic
   }
}