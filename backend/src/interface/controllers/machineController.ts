import { Request, Response } from 'express';
import { container } from '../../config/container';
import { asyncWrapper } from '../../shared/utils/asyncWrapper';
import { GetAllMachinesUseCase } from '../../application/use-cases/machines/GetAllMachinesUseCase';
import { CreateMachineUseCase } from '../../application/use-cases/machines/CreateMachineUseCase';
import { GetMachineByIdUseCase } from '../../application/use-cases/machines/GetMachineByIdUseCase';

export class MachineController {
  static getAllMachines = asyncWrapper(async (req: Request, res: Response) => {
  const getAllMachinesUseCase = container.resolve(GetAllMachinesUseCase);
  const machines = await getAllMachinesUseCase.execute();
  
  res.status(200).json({
    success: true,
    data: machines.map((machine: any) => machine.toJson()),  // Add : any
    count: machines.length
  });
});

  static getMachineById = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const getMachineByIdUseCase = container.resolve(GetMachineByIdUseCase);
    const machine = await getMachineByIdUseCase.execute(id);
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: machine.toJson()
    });
  });

  static createMachine = asyncWrapper(async (req: Request, res: Response) => {
    const createMachineUseCase = container.resolve(CreateMachineUseCase);
    const machine = await createMachineUseCase.execute(req.body);
    
    res.status(201).json({
      success: true,
      data: machine.toJson(),
      message: 'Machine created successfully'
    });
  });

  static updateMachine = asyncWrapper(async (req: Request, res: Response) => {
    // TODO: Implement
    res.status(200).json({ success: true, message: 'Update endpoint' });
  });

  static deleteMachine = asyncWrapper(async (req: Request, res: Response) => {
    // TODO: Implement
    res.status(200).json({ success: true, message: 'Delete endpoint' });
  });
}