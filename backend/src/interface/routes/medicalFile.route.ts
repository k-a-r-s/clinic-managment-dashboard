import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { Role } from "../../shared/lib/roles";
import { validate } from "../middlewares/Validate";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { medicalFileController } from "../../config/container";
import { createMedicalFileDtoSchema } from "../../application/dto/requests/createMedicalFIleDto";
import { updateMedicalFileDtoSchema } from "../../application/dto/requests/updateMedicalFileDto";

const router = Router();

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
router.post(
  "/",
  authMiddleware,
  requireRole([Role.DOCTOR, Role.ADMIN]),
  validate(createMedicalFileDtoSchema),
  asyncWrapper(medicalFileController.createMedicalFile.bind(medicalFileController))
);

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
router.get(
  "/patient/:patientId",
  authMiddleware,
  requireRole([Role.DOCTOR, Role.ADMIN, Role.RECEPTIONIST]),
  asyncWrapper(medicalFileController.getMedicalFileByPatientId.bind(medicalFileController))
);

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
router.put(
  "/:id",
  authMiddleware,
  requireRole([Role.DOCTOR, Role.ADMIN]),
  validate(updateMedicalFileDtoSchema),
  asyncWrapper(medicalFileController.updateMedicalFile.bind(medicalFileController))
);

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
router.delete(
  "/:id",
  authMiddleware,
  requireRole([Role.DOCTOR, Role.ADMIN]),
  asyncWrapper(medicalFileController.deleteMedicalFile.bind(medicalFileController))
);

export default router;
