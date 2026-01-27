"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const roles_1 = require("../../shared/lib/roles");
const Validate_1 = require("../middlewares/Validate");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const container_1 = require("../../config/container");
const createMedicalFIleDto_1 = require("../../application/dto/requests/createMedicalFIleDto");
const updateMedicalFileDto_1 = require("../../application/dto/requests/updateMedicalFileDto");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalFile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The medical file ID
 *         doctorId:
 *           type: string
 *           format: uuid
 *           description: The doctor ID
 *         data:
 *           type: object
 *           description: Medical file data (flexible schema)
 */
/**
 * @swagger
 * /medical-files:
 *   post:
 *     summary: Create a new medical file
 *     tags: [Medical Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - doctorId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               data:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Medical file created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Medical file created successfully
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor only
 */
router.post("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, Validate_1.validate)(createMedicalFIleDto_1.createMedicalFileDtoSchema), (0, asyncWrapper_1.asyncWrapper)(container_1.medicalFileController.createMedicalFile.bind(container_1.medicalFileController)));
/**
 * @swagger
 * /medical-files/patient/{patientId}:
 *   get:
 *     summary: Get medical file by patient ID
 *     tags: [Medical Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Medical file retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/MedicalFile'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Medical file not found
 */
router.get("/patient/:patientId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.medicalFileController.getMedicalFileByPatientId.bind(container_1.medicalFileController)));
/**
 * @swagger
 * /medical-files/{id}:
 *   put:
 *     summary: Update a medical file
 *     tags: [Medical Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The medical file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               data:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Medical file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Medical file updated successfully
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor only
 *       404:
 *         description: Medical file not found
 */
router.put("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, Validate_1.validate)(updateMedicalFileDto_1.updateMedicalFileDtoSchema), (0, asyncWrapper_1.asyncWrapper)(container_1.medicalFileController.updateMedicalFile.bind(container_1.medicalFileController)));
/**
 * @swagger
 * /medical-files/{id}:
 *   delete:
 *     summary: Delete a medical file by ID
 *     tags: [Medical Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The medical file ID
 *     responses:
 *       200:
 *         description: Medical file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Medical file deleted successfully
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor or Admin only
 *       404:
 *         description: Medical file not found
 */
router.delete("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.medicalFileController.deleteMedicalFile.bind(container_1.medicalFileController)));
exports.default = router;
