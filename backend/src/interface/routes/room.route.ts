import { Router } from "express";
import { container } from "../../config/container";
import { RoomController } from "../controllers/roomController";
import { validate } from "../middlewares/Validate";
import { createRoomDto } from "../../application/dto/requests/rooms/createRoomDto";
import { updateRoomDto } from "../../application/dto/requests/rooms/updateRoomDto";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { z } from "zod";

const router = Router();
const roomController = container.resolve<RoomController>("roomController");

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
router.post(
  "/",
  authMiddleware,
  requireRole(["admin", "receptionist"]),
  validate(createRoomDto),
  asyncWrapper(roomController.createRoom.bind(roomController))
);

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
router.get(
  "/",
  authMiddleware,
  asyncWrapper(roomController.getAllRooms.bind(roomController))
);

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
router.get(
  "/available",
  authMiddleware,
  asyncWrapper(roomController.getAvailableRooms.bind(roomController))
);

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
router.get(
  "/:id",
  authMiddleware,
  asyncWrapper(roomController.getRoomById.bind(roomController))
);

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
router.post(
  "/:id",
  // authMiddleware,
  // requireRole(["admin", "receptionist"]),
  validate(updateRoomDto),
  asyncWrapper(roomController.updateRoom.bind(roomController))
);

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
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(roomController.deleteRoom.bind(roomController))
);

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
router.patch(
  "/:id/availability",
  authMiddleware,
  requireRole(["admin", "receptionist", "doctor"]),
  validate(z.object({ isAvailable: z.boolean() })),
  asyncWrapper(roomController.updateRoomAvailability.bind(roomController))
);

export default router;
