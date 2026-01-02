import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { CreateMachineUseCase } from "../../application/use-cases/machines/CreateMachineUseCase";
import { GetAllMachinesUseCase } from "../../application/use-cases/machines/GetAllMachinesUseCase";
import { GetMachineByIdUseCase } from "../../application/use-cases/machines/GetMachineByIdUseCase";
import { UpdateMachineUseCase } from "../../application/use-cases/machines/UpdateMachineUseCase";
import { DeactivateMachineUseCase } from "../../application/use-cases/machines/DeactivateMachineUseCase";
import { DeleteMachine } from "../../application/use-cases/machines/DeleteMachine";
import { GetMachineStatsUseCase } from "../../application/use-cases/machines/GetMachineStatsUseCase";
import { GetMachineStatsFormattedUseCase } from "../../application/use-cases/machines/GetMachineStatsFormattedUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class MachineController {
  constructor(
    private createMachineUseCase: CreateMachineUseCase,
    private getAllMachinesUseCase: GetAllMachinesUseCase,
    private getMachineByIdUseCase: GetMachineByIdUseCase,
    private updateMachineUseCase: UpdateMachineUseCase,
    private deactivateMachineUseCase: DeactivateMachineUseCase,
    private deleteMachineUseCase: DeleteMachine,
    private getMachineStatsUseCase?: GetMachineStatsUseCase,
    private getMachineStatsFormattedUseCase?: GetMachineStatsFormattedUseCase
  ) {}

  async createMachine(req: AuthRequest, res: Response) {
    const { body } = req;
    const result = await this.createMachineUseCase.execute(body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Machine created successfully",
      201
    );
  }

  async getMachines(req: AuthRequest, res: Response) {
    const { status, roomId } = req.query as {
      status?: string;
      roomId?: string;
    };
    const result = await this.getAllMachinesUseCase.execute({ status, roomId });
    return ResponseFormatter.success(
      res,
      result.map((m) => m.toJson()),
      "Machines retrieved successfully"
    );
  }

  async getMachineById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.getMachineByIdUseCase.execute(id);
    if (!result) {
      return ResponseFormatter.error(
        res,
        { type: "NotFoundError", message: "Machine not found" },
        404,
        "Machine not found"
      );
    }
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Machine retrieved successfully"
    );
  }

  async updateMachine(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const result = await this.updateMachineUseCase.execute(id, body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Machine updated successfully"
    );
  }

  async deactivateMachine(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deactivateMachineUseCase.execute(id);
    return ResponseFormatter.success(
      res,
      null,
      "Machine deactivated successfully"
    );
  }

  async deleteMachine(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deleteMachineUseCase.execute(id);
    return ResponseFormatter.success(res, null, "Machine deleted successfully");
  }

  async getStats(req: AuthRequest, res: Response) {
    if (!this.getMachineStatsUseCase) {
      return ResponseFormatter.error(
        res,
        { type: "InternalServerError", message: "Machine stats not available" },
        500,
        "Machine stats not available"
      );
    }
    const result = await this.getMachineStatsUseCase.execute();
    return ResponseFormatter.success(
      res,
      result,
      "Machine stats retrieved successfully"
    );
  }

  async getFormattedStats(req: AuthRequest, res: Response) {
    if (!this.getMachineStatsFormattedUseCase) {
      return ResponseFormatter.error(
        res,
        { type: "InternalServerError", message: "Machine stats not available" },
        500,
        "Machine stats not available"
      );
    }
    const result = await this.getMachineStatsFormattedUseCase.execute();
    return ResponseFormatter.success(
      res,
      result,
      "Machine stats retrieved successfully"
    );
  }
}
