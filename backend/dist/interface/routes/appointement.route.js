"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../config/container");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const requireRole_1 = require("../middlewares/requireRole");
const Validate_1 = require("../middlewares/Validate");
const addAppointementDto_1 = require("../../application/dto/requests/addAppointementDto");
const updateAppointmentDto_1 = require("../../application/dto/requests/updateAppointmentDto");
const updateAppointmentHistoryDto_1 = require("../../application/dto/requests/appointmentHistory/updateAppointmentHistoryDto");
const completeAppointmentDto_1 = require("../../application/dto/requests/appointmentHistory/completeAppointmentDto");
const roles_1 = require("../../shared/lib/roles");
const router = (0, express_1.Router)();
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
 *         doctorId:
 *           type: string
 *           format: uuid
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *           description: Appointment date and time
 *         status:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELED, NO_SHOW]
 *         roomId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The room ID
 *         estimatedDurationInMinutes:
 *           type: integer
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
 *         - appointmentDate
 *         - estimatedDurationInMinutes
 *         - status
 *       properties:
 *         patientId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         doctorId:
 *           type: string
 *           format: uuid
 *           example: 987fcdeb-51a2-43f1-b9c8-123456789abc
 *         roomId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdByReceptionistId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdByDoctorId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *           example: 2024-12-15T14:30:00.000Z
 *         estimatedDurationInMinutes:
 *           type: integer
 *           example: 30
 *         status:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELED, NO_SHOW]
 *           example: SCHEDULED
 *     AppointmentHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The history record ID
 *         appointmentId:
 *           type: string
 *           format: uuid
 *           description: The appointment ID
 *         appointmentData:
 *           type: object
 *           description: Appointment results/data snapshot
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the history was recorded
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the history was last updated
 *     UpdateAppointmentHistoryRequest:
 *       type: object
 *       properties:
 *         appointmentData:
 *           type: object
 *           description: Updated appointment data
 *     AppointmentDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         patient:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *         doctor:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *         roomId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdByReceptionistId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdByDoctorId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *         estimatedDurationInMinutes:
 *           type: number
 *         status:
 *           type: string
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
 *     summary: Create an appointment
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
 *                   $ref: '#/components/schemas/AppointmentDetail'
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Receptionist, Doctor or Admin role required
 *       404:
 *         description: Room not found
 *       409:
 *         description: Conflict - room is already booked or not available for the requested time
 */
router.post("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.RECEPTIONIST, roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, Validate_1.validate)(addAppointementDto_1.addAppointmentDto), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.createAppointment.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments with optional time-based and name-based filtering
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
 *       - in: query
 *         name: patientName
 *         schema:
 *           type: string
 *         description: Filter by patient name (partial match)
 *       - in: query
 *         name: doctorName
 *         schema:
 *           type: string
 *         description: Filter by doctor name (partial match)
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
// Get all appointments with optional view filter (year/month/week/day) and optional name filters
router.get("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.getAllAppointments.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}:
 *   get:
 *     summary: Get an appointment by ID
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
 *         description: Appointment retrieved successfully
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
 *                   example: Appointment retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *                 error:
 *                   type: null
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get appointment by ID
router.get("/:appointmentId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.getAppointmentById.bind(container_1.appointementController)));
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
router.get("/doctor/:doctorId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.getAppointmentsByDoctor.bind(container_1.appointementController)));
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
router.get("/patient/:patientId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.getAppointmentsByPatient.bind(container_1.appointementController)));
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
router.delete("/:appointmentId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.deleteAppointment.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}:
 *   put:
 *     summary: Update an appointment
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               roomId:
 *                 type: string
 *                 format: uuid
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               estimatedDurationInMinutes:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELED, NO_SHOW]
 *     responses:
 *       200:
 *         description: Appointment updated successfully
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
 *                   example: Appointment updated successfully
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.put("/:appointmentId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST, roles_1.Role.ADMIN]), (0, Validate_1.validate)(updateAppointmentDto_1.updateAppointmentDto), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.updateAppointment.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}/complete:
 *   post:
 *     summary: Complete an appointment and record medical history
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *                 description: The patient ID
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *                 description: The doctor ID
 *               appointmentData:
 *                 type: object
 *                 description: Medical data/results from appointment
 *     responses:
 *       200:
 *         description: Appointment completed and history recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor or Admin role required
 *       404:
 *         description: Appointment not found
 *       409:
 *         description: Conflict - Appointment is not in SCHEDULED status
 */
router.post("/:appointmentId/complete", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, Validate_1.validate)(completeAppointmentDto_1.completeAppointmentDto), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.completeAppointment.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}/history:
 *   get:
 *     summary: Get appointment history
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
 *         description: Appointment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AppointmentHistory'
 *       404:
 *         description: History not found
 */
router.get("/:appointmentId/history", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.getHistoryByAppointmentId.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}/history:
 *   put:
 *     summary: Update appointment history
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointmentHistoryRequest'
 *     responses:
 *       200:
 *         description: Appointment history updated successfully
 *       404:
 *         description: History not found
 */
router.put("/:appointmentId/history", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.DOCTOR, roles_1.Role.ADMIN]), (0, Validate_1.validate)(updateAppointmentHistoryDto_1.updateAppointmentHistoryDto), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.updateHistory.bind(container_1.appointementController)));
/**
 * @swagger
 * /appointments/{appointmentId}/history:
 *   delete:
 *     summary: Delete appointment history
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
 *         description: Appointment history deleted successfully
 *       404:
 *         description: History not found
 */
router.delete("/:appointmentId/history", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.appointementController.deleteHistory.bind(container_1.appointementController)));
exports.default = router;
