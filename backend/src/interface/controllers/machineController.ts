import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateMachineUseCase } from '../../application/use-cases/machines/CreateMachineUseCase';
import { GetAllMachinesUseCase } from '../../application/use-cases/machines/GetAllMachinesUseCase';
import { GetMachineByIdUseCase } from '../../application/use-cases/machines/GetMachineByIdUseCase';
import { UpdateMachineUseCase } from '../../application/use-cases/machines/UpdateMachineUseCase';
import { DeactivateMachineUseCase } from '../../application/use-cases/machines/DeactivateMachineUseCase';
import { ResponseFormatter } from '../utils/ResponseFormatter';

export class MachineController {
  constructor(
    private createMachineUseCase: CreateMachineUseCase,
    private getAllMachinesUseCase: GetAllMachinesUseCase,
    private getMachineByIdUseCase: GetMachineByIdUseCase,
    private updateMachineUseCase: UpdateMachineUseCase,
    private deactivateMachineUseCase: DeactivateMachineUseCase
  ) {}

  async createMachine(req: AuthRequest, res: Response) {
    const { body } = req;
    const result = await this.createMachineUseCase.execute(body);
    return ResponseFormatter.success(res, result.toJson(), 'Machine created successfully', 201);
  }

  async getMachines(req: AuthRequest, res: Response) {
    const { status, roomId } = req.query as { status?: string; roomId?: string };
    const result = await this.getAllMachinesUseCase.execute({ status, roomId });
    return ResponseFormatter.success(res, result.map((m) => m.toJson()), 'Machines retrieved successfully');
  }

  async getMachineById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.getMachineByIdUseCase.execute(id);
    if (!result) {
      return ResponseFormatter.notFound(res, 'Machine not found');
    }
    return ResponseFormatter.success(res, result.toJson(), 'Machine retrieved successfully');
  }

  async updateMachine(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const result = await this.updateMachineUseCase.execute(id, body);
    return ResponseFormatter.success(res, result.toJson(), 'Machine updated successfully');
  }

  async deactivateMachine(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deactivateMachineUseCase.execute(id);
    return ResponseFormatter.success(res, null, 'Machine deactivated successfully');
  }
}
