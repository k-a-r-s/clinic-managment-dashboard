"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../config/container");
const Validate_1 = require("../middlewares/Validate");
const createRoomDto_1 = require("../../application/dto/requests/rooms/createRoomDto");
const updateRoomDto_1 = require("../../application/dto/requests/rooms/updateRoomDto");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const roomController = container_1.container.resolve("roomController");
/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         roomNumber:
 *           type: string
 *           example: "101"
 *         capacity:
 *           type: integer
 *           example: 2
 *         type:
 *           type: string
 *           example: "consultation"
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateRoomRequest:
 *       type: object
 *       required:
 *         - roomNumber
 *       properties:
 *         roomNumber:
 *           type: string
 *           example: "101"
 *         capacity:
 *           type: integer
 *           example: 2
 *           default: 1
 *         type:
 *           type: string
 *           example: "consultation"
 *           default: "consultation"
 *         isAvailable:
 *           type: boolean
 *           example: true
 *           default: true
 *     UpdateRoomRequest:
 *       type: object
 *       properties:
 *         roomNumber:
 *           type: string
 *           example: "102"
 *         capacity:
 *           type: integer
 *           example: 3
 *         type:
 *           type: string
 *           example: "surgery"
 *         isAvailable:
 *           type: boolean
 *           example: false
 *     UpdateRoomAvailabilityRequest:
 *       type: object
 *       required:
 *         - isAvailable
 *       properties:
 *         isAvailable:
 *           type: boolean
 *           example: false
 */
/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomRequest'
 *     responses:
 *       201:
 *         description: Room created successfully
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
 *                   example: "Room created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 error:
 *                   type: null
 */
router.post("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin", "receptionist"]), (0, Validate_1.validate)(createRoomDto_1.createRoomDto), roomController.createRoom.bind(roomController));
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
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
 *                   example: "Rooms retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 error:
 *                   type: null
 */
router.get("/", authMiddleware_1.authMiddleware, roomController.getAllRooms.bind(roomController));
/**
 * @swagger
 * /rooms/available:
 *   get:
 *     summary: Get all available rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available rooms retrieved successfully
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
 *                   example: "Available rooms retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 error:
 *                   type: null
 */
router.get("/available", authMiddleware_1.authMiddleware, roomController.getAvailableRooms.bind(roomController));
/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
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
 *                   example: "Room retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 error:
 *                   type: null
 *       404:
 *         description: Room not found
 */
router.get("/:id", authMiddleware_1.authMiddleware, roomController.getRoomById.bind(roomController));
/**
 * @swagger
 * /rooms/{id}:
 *   patch:
 *     summary: Update a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomRequest'
 *     responses:
 *       200:
 *         description: Room updated successfully
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
 *                   example: "Room updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 error:
 *                   type: null
 *       404:
 *         description: Room not found
 */
router.patch("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin", "receptionist"]), (0, Validate_1.validate)(updateRoomDto_1.updateRoomDto), roomController.updateRoom.bind(roomController));
/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
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
 *                   example: "Room deleted successfully"
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       404:
 *         description: Room not found
 */
router.delete("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), roomController.deleteRoom.bind(roomController));
/**
 * @swagger
 * /rooms/{id}/availability:
 *   patch:
 *     summary: Update room availability
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomAvailabilityRequest'
 *     responses:
 *       200:
 *         description: Room availability updated successfully
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
 *                   example: "Room availability updated successfully"
 *                 data:
 *                   type: null
 *                 error:
 *                   type: null
 *       404:
 *         description: Room not found
 */
router.patch("/:id/availability", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin", "receptionist", "doctor"]), (0, Validate_1.validate)(zod_1.z.object({ isAvailable: zod_1.z.boolean() })), roomController.updateRoomAvailability.bind(roomController));
exports.default = router;
