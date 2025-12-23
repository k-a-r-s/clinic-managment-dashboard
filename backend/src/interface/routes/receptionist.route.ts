import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { requireRole } from "../middlewares/requireRole";
import { receptionistController as receptionistsController } from "../../config/container";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Receptionists
 *   description: The receptionists managing API
 */

router.get(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(receptionistsController.getReceptionists.bind(receptionistsController))
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(receptionistsController.getReceptionistById.bind(receptionistsController))
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(receptionistsController.updateReceptionistById.bind(receptionistsController))
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(receptionistsController.deleteReceptionistById.bind(receptionistsController))
);

export default router;
