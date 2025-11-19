import { Router } from "express";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/Validate";
import { LoginDto } from "../../application/dto/LoginDto";
import { UserAuthService } from "../../application/services/UserAuthService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";

const router = Router();

// ✅ Create instances (Dependency Injection)
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userAuthService = new UserAuthService(userRepository, authRepository);
const authController = new AuthController(userAuthService);

// ✅ Now call instance methods
router.post(
    "/sign-up",
    asyncWrapper((req, res) => authController.signUp(req, res))
);

router.post(
    "/login",
    validate(LoginDto),
    asyncWrapper((req, res) => authController.login(req, res))
);

router.post(
    "/logout",
    asyncWrapper((req, res) => authController.logout(req, res))
);

export default router;