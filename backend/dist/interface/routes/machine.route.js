"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const roles_1 = require("../../shared/lib/roles");
const Validate_1 = require("../middlewares/Validate");
const updateMachineDto_1 = require("../../application/dto/requests/updateMachineDto");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
/**
/**
 * @swagger
 * components:
 *   schemas:
 *     Machine:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         machineId:
 *           type: string
 *         manufacturer:
 *           type: string
 *         model:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, in-use, maintenance, out-of-service]
 *         lastMaintenanceDate:
 *           type: string
 *           format: date
 *         nextMaintenanceDate:
 *           type: string
 *           format: date
 *         isActive:
 *           type: boolean
 *         roomId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateMachineDto:
 *       type: object
 *       properties:
 *         machineId:
 *           type: string
 *         manufacturer:
 *           type: string
 *         model:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, in-use, maintenance, out-of-service]
 *         lastMaintenanceDate:
 *           type: string
 *           format: date
 *         nextMaintenanceDate:
 *           type: string
 *           format: date
 *         roomId:
 *           type: string
 *           format: uuid
 *         isActive:
 *           type: boolean
 *       required:
 *         - lastMaintenanceDate
 *         - nextMaintenanceDate
 *
 *     UpdateMachineDto:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateMachineDto'
 *       description: Partial fields allowed for update (all optional)
 *     MachineStatsFormatted:
 *       type: object
 *       properties:
 *         In_Use:
 *           type: integer
 *         Available:
 *           type: integer
 *         Out_of_Service:
 *           type: integer
 *         Maintenance:
 *           type: integer
 *         total:
 *           type: integer
 *
 *     MachineResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         status:
 *           type: integer
 *         data:
 *           $ref: '#/components/schemas/Machine'
 *         error:
 *           nullable: true
 *           type: object
 */
/**
 * @swagger
 * /machines:
 *   post:
 *     tags: [Machines]
 *     summary: Create a new machine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by room id (UUID)
 *     responses:
 *       201:
 *         description: Machine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineResponse'
 *       400:
 *         description: Validation error
 */
/**
 * @swagger
 * /machines:
 *   get:
 *     tags: [Machines]
 *     summary: Retrieve list of machines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, in-use, maintenance, out-of-service]
 *         description: Filter by machine status
 *       - in: query
 *         name: room
 *         schema:
 *           type: string
 *         description: Filter by room
 *     responses:
 *       200:
 *         description: List of machines
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
 *                     $ref: '#/components/schemas/Machine'
 *                 error:
 *                   nullable: true
 */
/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     tags: [Machines]
 *     summary: Get machine by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Machine found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineResponse'
 *       404:
 *         description: Machine not found
 */
/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     tags: [Machines]
 *     summary: Update a machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMachineDto'
 *     responses:
 *       200:
 *         description: Machine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Machine not found
 */
/**
 * @swagger
 * /machines/{id}/deactivate:
 *   patch:
 *     tags: [Machines]
 *     summary: Deactivate a machine (mark as out-of-service)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Machine deactivated successfully
 *       404:
 *         description: Machine not found
 */
/** Create machine */
router.post("/", authMiddleware_1.authMiddleware, (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.createMachine.bind(container_1.machineController)));
/** Get all machines */
router.get("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.getMachines.bind(container_1.machineController)));
/** Get machines stats */
router.get("/stats", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.getStats.bind(container_1.machineController)));
/**
 * @swagger
 * /machines/machine-stats:
 *   get:
 *     tags: [Machines]
 *     summary: Returns machine statistics with formatted keys
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Machine statistics (formatted)
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
 *                   $ref: '#/components/schemas/MachineStatsFormatted'
 *                 error:
 *                   nullable: true
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Doctor/Receptionist
 */
/** Get machine stats (formatted keys) */
router.get("/machine-stats", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.getFormattedStats.bind(container_1.machineController)));
/** Get machine by id */
router.get("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.getMachineById.bind(container_1.machineController)));
/** Update machine */
router.put("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN]), (0, Validate_1.validate)(updateMachineDto_1.updateMachineSchemaDto), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.updateMachine.bind(container_1.machineController)));
/** Deactivate machine */
router.patch("/:id/deactivate", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN]), (0, asyncWrapper_1.asyncWrapper)(container_1.machineController.deactivateMachine.bind(container_1.machineController)));
exports.default = router;
