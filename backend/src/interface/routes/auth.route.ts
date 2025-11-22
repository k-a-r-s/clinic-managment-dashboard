import { Router } from "express";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/Validate";
import { LoginDto } from "../../application/dto/requests/LoginDto";
import { UserAuthService } from "../../application/services/UserAuthService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateUserDtoSchema } from "../../application/dto/requests/CreateUserDto";
import { requireRole } from "../middlewares/requireAuth";

const router = Router();

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userAuthService = new UserAuthService(userRepository, authRepository);
const authController = new AuthController(userAuthService);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 expires_in:
 *                   type: number
 *                 token_type:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    validate(LoginDto),
    asyncWrapper((req, res) => authController.login(req, res))
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate session
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/logout",
    authMiddleware,
    asyncWrapper((req, res) => authController.logout(req, res))
);

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create new user
 *     description: Create a new user (admin only)
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [admin, doctor, receptionist]
 *                 example: doctor
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - admin only
 */
router.post(
    "/create-user",
    authMiddleware,
    requireRole(['admin']),
    validate(CreateUserDtoSchema),
    asyncWrapper((req, res) => authController.createUser(req, res))
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: sbr_1234567890abcdef
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     expires_in:
 *                       type: number
 *                     token_type:
 *                       type: string
 *       401:
 *         description: Invalid or expired token
 */
router.post(

    "/refresh-token",
    
    asyncWrapper((req, res) => authController.refreshToken(req, res))
);

export default router;