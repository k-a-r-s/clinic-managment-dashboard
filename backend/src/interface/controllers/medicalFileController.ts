import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createMedicalFileUseCase } from "../../application/use-cases/medicalFile/createMedicalFIleUseCase";
import { GetMedicalFileUseCase } from "../../application/use-cases/medicalFile/GetMedicalFileUseCase";
import { UpdateMedicalFileUseCase } from "../../application/use-cases/medicalFile/UpdateMedicalFileUseCase";
import { DeleteMedicalFileUseCase } from "../../application/use-cases/medicalFile/DeleteMedicalFileUseCase";

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
    res.status(201).json({
      success: true,
      status: 201,
      data: { message: "Medical file created successfully" },
      error: null,
    });
  }

  async getMedicalFileByPatientId(req: AuthRequest, res: Response) {
    const { patientId } = req.params;
    const result = await this.getMedicalFileUseCase.execute(patientId);
    res.json({
      success: true,
      status: 200,
      data: result,
      error: null,
    });
  }

  async updateMedicalFile(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { body } = req;
    await this.updateMedicalFileUseCase.execute(id, body);
    res.json({
      success: true,
      status: 200,
      data: { message: "Medical file updated successfully" },
      error: null,
    });
  }

  async deleteMedicalFile(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deleteMedicalFileUseCase.execute(id);
    res.json({
      success: true,
      status: 200,
      data: { message: "Medical file deleted successfully" },
      error: null,
    });
  }
}
