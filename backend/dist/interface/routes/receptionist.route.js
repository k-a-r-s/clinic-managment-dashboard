"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const requireRole_1 = require("../middlewares/requireRole");
const container_1 = require("../../config/container");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Receptionists
 *   description: The receptionists managing API
 */
router.get("/", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.receptionistController.getReceptionists.bind(container_1.receptionistController)));
router.get("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.receptionistController.getReceptionistById.bind(container_1.receptionistController)));
router.put("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.receptionistController.updateReceptionistById.bind(container_1.receptionistController)));
router.delete("/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)(["admin"]), (0, asyncWrapper_1.asyncWrapper)(container_1.receptionistController.deleteReceptionistById.bind(container_1.receptionistController)));
exports.default = router;
