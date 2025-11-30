import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { Role } from "../../shared/lib/roles";
import { validate } from "../middlewares/Validate";
import { addPatientSchemaDto } from "../../application/dto/requests/addpatientDto";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { PatientController } from "../controllers/patientController";
import { PatientRepository } from "../../infrastructure/repositories/PatientRepository";
import { GetPatientByIdUseCase } from "../../application/use-cases/patients/getPatientByIdUseCase";
import { Response } from "express";
import { AddPatientUseCase } from "../../application/use-cases/patients/addPatientUseCase";
import { DeletePatientByIdUseCase } from "../../application/use-cases/patients/deletePatientByIdUseCase";
import { GetAllPatientsUseCase } from "../../application/use-cases/patients/getAllPatientsUseCase";
const patientRepository = new PatientRepository();
const addPatientUseCase = new AddPatientUseCase(patientRepository);
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const deletePatientByIdUseCase = new DeletePatientByIdUseCase(
  patientRepository
);
const getAllPatientsUseCase = new GetAllPatientsUseCase(patientRepository);
const patientController = new PatientController(
  addPatientUseCase,
  getPatientByIdUseCase,
  deletePatientByIdUseCase,
  getAllPatientsUseCase
);
const router = Router();

router.post(
  "/add-patient",
  authMiddleware,
  requireRole([Role.ADMIN, Role.RECEPTIONIST]),
  validate(addPatientSchemaDto),
  asyncWrapper(patientController.addPatient.bind(patientController))
);

router.get(
  "/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.RECEPTIONIST]),
  asyncWrapper(patientController.getPatientById.bind(patientController))
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([Role.ADMIN, Role.RECEPTIONIST]),
  asyncWrapper(patientController.deletePatientById.bind(patientController))
);

// todo dont fetch all data of patient , just necessary ones like firstname , id , email and stuff
router.get(
  "/",
  authMiddleware,
  requireRole([Role.ADMIN, Role.RECEPTIONIST]),
  asyncWrapper(patientController.getAllPatients.bind(patientController))
);
export default router;
