import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { validate } from "../middlewares/Validate";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { CreateUserDtoSchema } from "../../application/dto/requests/CreateUserDto";
import { userController } from "../../config/container";

const router = Router();

/**
 * @swagger
 * /users/add-user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user (Doctor or Receptionist). Only admins can perform this action.
 *     tags:
 *       - Users
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
 *                 example: doctor@clinic.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: securePassword123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [doctor, receptionist]
 *                 example: doctor
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-string"
 *                     email:
 *                       type: string
 *                       example: doctor@clinic.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       example: doctor
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add-user",
  authMiddleware,
  requireRole(["admin"]),
  validate(CreateUserDtoSchema),
  asyncWrapper(userController.addUser.bind(userController))
);

export default router;
