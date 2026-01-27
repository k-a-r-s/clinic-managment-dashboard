"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const Validate_1 = require("../middlewares/Validate");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const CreateUserDto_1 = require("../../application/dto/requests/CreateUserDto");
const updateUserDto_1 = require("../../application/dto/requests/updateUserDto");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, doctor, receptionist]
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *         salary:
 *           type: number
 *           nullable: true
 *           description: Only for doctors
 *         specialization:
 *           type: string
 *           nullable: true
 *           description: Only for doctors
 *         isMedicalDirector:
 *           type: boolean
 *           nullable: true
 *           description: Only for doctors
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users with optional role filtering. Only admins can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, doctor, receptionist]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.userController.getAllUsers.bind(container_1.userController)));
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID. Only admins can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: null
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.userController.getUserById.bind(container_1.userController)));
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
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information. Role cannot be changed. Only admins can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@clinic.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               salary:
 *                 type: number
 *                 description: Only for doctors
 *                 example: 75000
 *               specialization:
 *                 type: string
 *                 description: Only for doctors
 *                 example: Cardiology
 *               isMedicalDirector:
 *                 type: boolean
 *                 description: Only for doctors
 *                 example: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, Validate_1.validate)(updateUserDto_1.updateUserSchemaDto), (0, asyncWrapper_1.asyncWrapper)(container_1.userController.updateUser.bind(container_1.userController)));
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     description: Soft delete a user by setting is_active to false. User data and related records are preserved. Only admins can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.userController.deleteUser.bind(container_1.userController)));
exports.default = router;
