"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const Validate_1 = require("../middlewares/Validate");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const CreateUserDto_1 = require("../../application/dto/requests/CreateUserDto");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
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
router.post("/add-user", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, Validate_1.validate)(CreateUserDto_1.CreateUserDtoSchema), (0, asyncWrapper_1.asyncWrapper)(container_1.userController.addUser.bind(container_1.userController)));
exports.default = router;
