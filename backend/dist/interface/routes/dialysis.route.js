"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const roles_1 = require("../../shared/lib/roles");
const Validate_1 = require("../middlewares/Validate");
const asyncWrapper_1 = require("../../shared/utils/asyncWrapper");
const container_1 = require("../../config/container");
const createDialysisPatientDto_1 = require("../../application/dto/requests/dialysis/createDialysisPatientDto");
const updateDialysisPatientDto_1 = require("../../application/dto/requests/dialysis/updateDialysisPatientDto");
const createProtocolDto_1 = require("../../application/dto/requests/dialysis/createProtocolDto");
const updateProtocolDto_1 = require("../../application/dto/requests/dialysis/updateProtocolDto");
const createSessionDto_1 = require("../../application/dto/requests/dialysis/createSessionDto");
const updateSessionDto_1 = require("../../application/dto/requests/dialysis/updateSessionDto");
const router = (0, express_1.Router)();
// ========== Dialysis Patients Routes ==========
router.post("/patients", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(createDialysisPatientDto_1.createDialysisPatientDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.createDialysisPatient.bind(container_1.dialysisController)));
router.get("/patients", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.getAllDialysisPatients.bind(container_1.dialysisController)));
router.put("/patients/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(updateDialysisPatientDto_1.updateDialysisPatientDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.updateDialysisPatient.bind(container_1.dialysisController)));
// ========== Protocols Routes ==========
router.post("/protocols", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(createProtocolDto_1.createProtocolDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.createProtocol.bind(container_1.dialysisController)));
router.get("/protocols/patient/:dialysisPatientId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.getProtocolByPatientId.bind(container_1.dialysisController)));
router.put("/protocols/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(updateProtocolDto_1.updateProtocolDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.updateProtocol.bind(container_1.dialysisController)));
// ========== Sessions Routes ==========
router.post("/sessions", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(createSessionDto_1.createSessionDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.createSession.bind(container_1.dialysisController)));
router.get("/sessions/patient/:dialysisPatientId", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.getSessionsByPatientId.bind(container_1.dialysisController)));
router.get("/sessions/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR, roles_1.Role.RECEPTIONIST]), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.getSessionById.bind(container_1.dialysisController)));
router.put("/sessions/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, Validate_1.validate)(updateSessionDto_1.updateSessionDto), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.updateSession.bind(container_1.dialysisController)));
router.delete("/sessions/:id", authMiddleware_1.authMiddleware, (0, requireRole_1.requireRole)([roles_1.Role.ADMIN, roles_1.Role.DOCTOR]), (0, asyncWrapper_1.asyncWrapper)(container_1.dialysisController.deleteSession.bind(container_1.dialysisController)));
exports.default = router;
