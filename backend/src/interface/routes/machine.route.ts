import { Router } from 'express';
import { MachineController } from '../controllers/machineController';

const router = Router();

router.get('/', MachineController.getAllMachines);
router.get('/:id', MachineController.getMachineById);
router.post('/', MachineController.createMachine);
router.put('/:id', MachineController.updateMachine);
router.delete('/:id', MachineController.deleteMachine);

export default router;