import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { Role } from "../../shared/lib/roles";
import { validate } from "../middlewares/Validate";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { dialysisController } from "../../config/container";
import { createDialysisPatientDto } from "../../application/dto/requests/dialysis/createDialysisPatientDto";
import { updateDialysisPatientDto } from "../../application/dto/requests/dialysis/updateDialysisPatientDto";
import { createProtocolDto } from "../../application/dto/requests/dialysis/createProtocolDto";
import { updateProtocolDto } from "../../application/dto/requests/dialysis/updateProtocolDto";
import { createSessionDto } from "../../application/dto/requests/dialysis/createSessionDto";
import { updateSessionDto } from "../../application/dto/requests/dialysis/updateSessionDto";

const router = Router();

// ========== Dialysis Patients Routes ==========
router.post(
  "/patients",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(createDialysisPatientDto),
  asyncWrapper(
    dialysisController.createDialysisPatient.bind(dialysisController)
  )
);

router.get(
  "/patients",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]),
  asyncWrapper(
    dialysisController.getAllDialysisPatients.bind(dialysisController)
  )
);

router.put(
  "/patients/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(updateDialysisPatientDto),
  asyncWrapper(
    dialysisController.updateDialysisPatient.bind(dialysisController)
  )
);

// ========== Protocols Routes ==========
router.post(
  "/protocols",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(createProtocolDto),
  asyncWrapper(dialysisController.createProtocol.bind(dialysisController))
);

router.get(
  "/protocols/patient/:dialysisPatientId",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]),
  asyncWrapper(
    dialysisController.getProtocolByPatientId.bind(dialysisController)
  )
);

router.put(
  "/protocols/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(updateProtocolDto),
  asyncWrapper(dialysisController.updateProtocol.bind(dialysisController))
);

// ========== Sessions Routes ==========
router.post(
  "/sessions",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(createSessionDto),
  asyncWrapper(dialysisController.createSession.bind(dialysisController))
);

router.get(
  "/sessions/patient/:dialysisPatientId",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]),
  asyncWrapper(
    dialysisController.getSessionsByPatientId.bind(dialysisController)
  )
);

router.get(
  "/sessions/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]),
  asyncWrapper(dialysisController.getSessionById.bind(dialysisController))
);

router.put(
  "/sessions/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  validate(updateSessionDto),
  asyncWrapper(dialysisController.updateSession.bind(dialysisController))
);

router.delete(
  "/sessions/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.DOCTOR]),
  asyncWrapper(dialysisController.deleteSession.bind(dialysisController))
);

export default router;
