import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescriptionController';

const router = Router();

router.post('/', PrescriptionController.createPrescription);
router.get('/patient/:patientId', PrescriptionController.getPrescriptionsByPatient);
router.get('/:id', PrescriptionController.getPrescriptionById);
router.put('/:id', PrescriptionController.updatePrescription);
router.delete('/:id', PrescriptionController.deletePrescription);

export default router;