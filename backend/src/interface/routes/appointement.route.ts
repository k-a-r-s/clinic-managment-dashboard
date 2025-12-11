import { Router } from 'express';
import { appointementController } from '../../config/container';
import { authMiddleware } from '../middlewares/authMiddleware';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';
import { requireRole } from '../middlewares/requireRole';
import { validate } from '../middlewares/Validate';
import { addAppointmentDto } from '../../application/dto/requests/addAppointementDto';
import { Role } from '../../shared/lib/roles';

const router = Router();

// Create appointment
router.post(
    '/',
    authMiddleware,
    requireRole([Role.RECEPTIONIST, Role.DOCTOR, Role.ADMIN]),
    validate(addAppointmentDto),
    asyncWrapper(appointementController.createAppointment.bind(appointementController))

);

// Get all appointments with optional view filter (year/month/week/day)
router.get(
    '/',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAllAppointments.bind(appointementController))
);

// Get appointments by doctor ID
router.get(
    '/doctor/:doctorId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAppointmentsByDoctor.bind(appointementController))
);

// Get appointments by patient ID
router.get(
    '/patient/:patientId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.getAppointmentsByPatient.bind(appointementController))
);

// Delete appointment
router.delete(
    '/:appointmentId',
    authMiddleware,
    requireRole([Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN]),
    asyncWrapper(appointementController.deleteAppointment.bind(appointementController))
);

export default router;