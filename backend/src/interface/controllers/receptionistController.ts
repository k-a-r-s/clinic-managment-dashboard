import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetReceptionistsListUseCase } from "../../application/use-cases/receptionists/GetAllReceptionistsUseCase";
import { GetReceptionistUseCase } from "../../application/use-cases/receptionists/getReceptionistUseCase";
import { DeleteReceptionistByIdUseCase } from "../../application/use-cases/receptionists/DeleteReceptionistByIdUseCase";
import { UpdateReceptionistByIdUseCase } from "../../application/use-cases/receptionists/updateReceptionistByIdUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class ReceptionistController {
  constructor(
    private getListUseCase: GetReceptionistsListUseCase,
    private deleteUseCase: DeleteReceptionistByIdUseCase,
    private getByIdUseCase: GetReceptionistUseCase,
    private updateUseCase: UpdateReceptionistByIdUseCase
  ) {}

  async getReceptionists(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.getListUseCase.execute(page, limit);
    return ResponseFormatter.success(res, response, "Receptionists retrieved successfully");
  }

  async getReceptionistById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.getByIdUseCase.execute(id);
    return ResponseFormatter.success(res, response, "Receptionist retrieved successfully");
  }

  async deleteReceptionistById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    await this.deleteUseCase.execute(id);
    return ResponseFormatter.success(res, null, "Receptionist deleted successfully");
  }

  async updateReceptionistById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.updateUseCase.execute(id, req.body);
    return ResponseFormatter.success(res, response, "Receptionist updated successfully");
  }
}
