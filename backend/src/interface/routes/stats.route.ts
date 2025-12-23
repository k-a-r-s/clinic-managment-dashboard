import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { Role } from '../../shared/lib/roles';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';
import { statsController as controller } from '../../config/container';

const router = Router();

/**
 * @swagger
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
 *                   type: object
 *                   properties:
 *                     totalPatients:
 *                       type: integer
 *                     activeSessions:
 *                       type: integer
 *                     activemachines:
 *                       type: integer
 *                     staffCount:
 *                       type: integer
 *                     staffSublabel:
 *                       type: string
 *                 error:
 *                   nullable: true
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, requireRole([Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]), asyncWrapper(controller.getStats.bind(controller)));

export default router;
