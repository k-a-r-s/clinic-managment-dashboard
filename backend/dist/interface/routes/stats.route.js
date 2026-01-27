"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
exports.default = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     PatientsPerDayItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-12-22"
 *         count:
 *           type: integer
 *           example: 2
 *     AppointmentsPerDayItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-12-22"
 *         count:
 *           type: integer
 *           example: 3
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalPatients:
 *           type: integer
 *         activeSessions:
 *           type: integer
 *         activemachines:
 *           type: integer
 *         staffCount:
 *           type: integer
 *         staffSublabel:
 *           type: string
 *         patientsThisWeek:
 *           type: integer
 *         appointmentsThisWeek:
 *           type: integer
 *         patientsPerDay:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PatientsPerDayItem'
 *         appointmentsPerDay:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AppointmentsPerDayItem'
 *     StatsSummary:
 *       type: object
 *       properties:
 *         totalPatients:
 *           type: integer
 *         activeSessions:
 *           type: integer
 *         activemachines:
 *           type: integer
 *         staffCount:
 *           type: integer
 *         staffSublabel:
 *           type: string
 *         patientsThisWeek:
 *           type: integer
 *         appointmentsThisWeek:
 *           type: integer
 *
 * /stats:
 *   get:
 *     tags: [Stats]
 *     summary: Get consolidated dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *                 error:
 *                   nullable: true
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /stats/patients-per-day:
 *   get:
 *     tags: [Stats]
 *     summary: Get patients created per day for the current week
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patients per day
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PatientsPerDayItem'
 *                 error:
 *                   nullable: true
 *                   type: object
 *
 * /stats/appointments-per-day:
 *   get:
 *     tags: [Stats]
 *     summary: Get appointments scheduled per day for the current week
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments per day
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppointmentsPerDayItem'
 *                 error:
 *                   nullable: true
 *                   type: object
 *
 * /stats/summary:
 *   get:
 *     tags: [Stats]
 *     summary: Get compact stats summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/StatsSummary'
 *                 error:
 *                   nullable: true
 *                   type: object
 */
router.get('/', authMiddleware_1.authMiddleware, (0, asyncWrapper_1.asyncWrapper)(container_1.statsController.getStats.bind(container_1.statsController)));
router.get('/patients-per-day', authMiddleware_1.authMiddleware, (0, asyncWrapper_1.asyncWrapper)(container_1.statsController.getPatientsPerDay.bind(container_1.statsController)));
router.get('/appointments-per-day', authMiddleware_1.authMiddleware, (0, asyncWrapper_1.asyncWrapper)(container_1.statsController.getAppointmentsPerDay.bind(container_1.statsController)));
router.get('/summary', authMiddleware_1.authMiddleware, (0, asyncWrapper_1.asyncWrapper)(container_1.statsController.getSummary.bind(container_1.statsController)));
