import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createMedicalFileUseCase } from "../../application/use-cases/medicalFile/createMedicalFIleUseCase";
import { GetMedicalFileUseCase } from "../../application/use-cases/medicalFile/GetMedicalFileUseCase";
import { UpdateMedicalFileUseCase } from "../../application/use-cases/medicalFile/UpdateMedicalFileUseCase";
import { DeleteMedicalFileUseCase } from "../../application/use-cases/medicalFile/DeleteMedicalFileUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class MedicalFileController {
  constructor(
    private createMedicalFileUseCase: createMedicalFileUseCase,
    private getMedicalFileUseCase: GetMedicalFileUseCase,
    private updateMedicalFileUseCase: UpdateMedicalFileUseCase,
    private deleteMedicalFileUseCase: DeleteMedicalFileUseCase
  ) {}

  async createMedicalFile(req: AuthRequest, res: Response) {
    const { body } = req;
    await this.createMedicalFileUseCase.execute(body);
    return ResponseFormatter.success(res, null, "Medical file created successfully", 201);
  }

  async getMedicalFileByPatientId(req: AuthRequest, res: Response) {
    const { patientId } = req.params;
    const result = await this.getMedicalFileUseCase.execute(patientId);
    return ResponseFormatter.success(res, result, "Medical file retrieved successfully");
  }

  async updateMedicalFile(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { body } = req;
    await this.updateMedicalFileUseCase.execute(id, body);
    return ResponseFormatter.success(res, null, "Medical file updated successfully");
  }

  async deleteMedicalFile(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deleteMedicalFileUseCase.execute(id);
    return ResponseFormatter.success(res, null, "Medical file deleted successfully");
  }
}
