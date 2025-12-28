import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { Role } from '../../shared/lib/roles';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';
import { statsController as controller } from '../../config/container';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalPatients:
 *           type: integer
 *           description: Total number of registered patients
 *           example: 123
 *         activeSessions:
 *           type: integer
 *           description: Number of appointments scheduled for today with status SCHEDULED
 *           example: 8
 *         activemachines:
 *           type: integer
 *           description: Number of machines currently available (total - out_of_service)
 *           example: 37
 *         staffCount:
 *           type: integer
 *           description: Total staff count (doctors + receptionists)
 *           example: 12
 *         staffSublabel:
 *           type: string
 *           description: Human readable breakdown of staff counts
 *           example: "8 doctors, 4 receptionists"
 *         patientsThisWeek:
 *           type: integer
 *           description: Number of patients created in the current week
 *           example: 5
 *         appointmentsThisWeek:
 *           type: integer
 *           description: Number of appointments scheduled in the current week
 *           example: 12
                patientsPerDay:
                    type: array
                    items:
                        type: object
                        properties:
                            date:
                                type: string
                                example: "2024-12-22"
                            count:
                                type: integer
                                example: 1
                appointmentsPerDay:
                    type: array
                    items:
                        type: object
                        properties:
                            date:
                                type: string
                                example: "2024-12-22"
                            count:
                                type: integer
                                example: 3
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
 *                   type: number
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *                 error:
 *                   nullable: true
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware,
    requireRole([Role.ADMIN]),
    asyncWrapper(controller.getStats.bind(controller)));

export default router;
