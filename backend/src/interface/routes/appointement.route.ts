import { Router } from 'express';
import { appointementController } from '../../config/container';
import { authMiddleware } from '../middlewares/authMiddleware';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';
import { requireRole } from '../middlewares/requireRole';
import { validate } from '../middlewares/Validate';
import { addAppointmentDto } from '../../application/dto/requests/addAppointementDto';
import { Role } from '../../shared/lib/roles';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The appointment ID
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: The patient ID
 *         doctorId:
 *           type: string
 *           format: uuid
 *           description: The doctor ID
 *         date:
 *           type: string
 *           format: date-time
 *           description: Appointment date and time
 *         reason:
 *           type: string
 *           description: Reason for appointment
 *         status:
 *           type: string
 *           example: scheduled
 *           description: Appointment status
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional notes
 *         roomId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The room ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAppointmentRequest:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - date
 *         - reason
 *       properties:
 *         patientId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         doctorId:
 *           type: string
 *           format: uuid
 *           example: 987fcdeb-51a2-43f1-b9c8-123456789abc
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2024-12-15T14:30:00.000Z
 *         reason:
 *           type: string
 *           example: Regular checkup
 *         status:
 *           type: string
 *           example: scheduled
 *         notes:
 *           type: string
 *           nullable: true
 *           example: Patient requested afternoon slot
 *         roomId:
 *           type: string
 *           format: uuid
 *           nullable: true
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: The appointments managing API
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                   example: Appointment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Receptionist, Doctor or Admin role required
 */
router.post(
    '/',
    authMiddleware,
    requireRole([Role.RECEPTIONIST, Role.DOCTOR, Role.ADMIN]),
    validate(addAppointmentDto),
    asyncWrapper(appointementController.createAppointment.bind(appointementController))

);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments with optional time-based filtering
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [year, month, week, day, all]
 *           default: month
 *         description: Time period filter
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Reference date for filtering (ISO 8601 format)
 *     responses:
 *       200:
 *         description: List of appointments
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
 *                   example: Appointments retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get all appointments with optional view filter (year/month/week/day)
router.get(
    '/',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAllAppointments.bind(appointementController))
);

/**
 * @swagger
 * /appointments/doctor/{doctorId}:
 *   get:
 *     summary: Get appointments by doctor ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The doctor ID
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [year, month, week, day, all]
 *           default: month
 *         description: Time period filter
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Reference date for filtering
 *     responses:
 *       200:
 *         description: Doctor's appointments retrieved successfully
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Doctor not found
 */
// Get appointments by doctor ID
router.get(
    '/doctor/:doctorId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAppointmentsByDoctor.bind(appointementController))
);

/**
 * @swagger
 * /appointments/patient/{patientId}:
 *   get:
 *     summary: Get appointments by patient ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The patient ID
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [year, month, week, day, all]
 *           default: month
 *         description: Time period filter
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Reference date for filtering
 *     responses:
 *       200:
 *         description: Patient's appointments retrieved successfully
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient not found
 */
// Get appointments by patient ID
router.get(
    '/patient/:patientId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAppointmentsByPatient.bind(appointementController))
);

/**
 * @swagger
 * /appointments/{appointmentId}:
 *   delete:
 *     summary: Delete/cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
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
 *                   example: Appointment deleted successfully
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
// Delete appointment
router.delete(
    '/:appointmentId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.deleteAppointment.bind(appointementController))
);

export default router;