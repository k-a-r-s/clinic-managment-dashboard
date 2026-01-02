import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { CreatePrescriptionUseCase } from "../../application/use-cases/prescription/CreatePrescriptionUseCase";
import { GetPrescriptionsUseCase } from "../../application/use-cases/prescription/GetPrescriptionsUseCase";
import { GetPrescriptionByIdUseCase } from "../../application/use-cases/prescription/GetPrescriptionByIdUseCase";
import { GetPrescriptionsByPatientIdUseCase } from "../../application/use-cases/prescription/GetPrescriptionsByPatientIdUseCase";
import { UpdatePrescriptionUseCase } from "../../application/use-cases/prescription/UpdatePrescriptionUseCase";
import { DeletePrescriptionUseCase } from "../../application/use-cases/prescription/DeletePrescriptionUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class PrescriptionController {
  constructor(
    private createPrescriptionUseCase: CreatePrescriptionUseCase,
    private getPrescriptionsUseCase: GetPrescriptionsUseCase,
    private getPrescriptionByIdUseCase: GetPrescriptionByIdUseCase,
    private getPrescriptionsByPatientIdUseCase: GetPrescriptionsByPatientIdUseCase,
    private updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    private deletePrescriptionUseCase: DeletePrescriptionUseCase
  ) {}

  async createPrescription(req: AuthRequest, res: Response) {
    const prescription = await this.createPrescriptionUseCase.execute(req.body);
    return ResponseFormatter.success(
      res,
      prescription,
      "Prescription created successfully",
      201
    );
  }

  async getPrescriptions(req: AuthRequest, res: Response) {
    const prescriptions = await this.getPrescriptionsUseCase.execute();
    return ResponseFormatter.success(
      res,
      prescriptions,
      "Prescriptions retrieved successfully"
    );
  }

  async getPrescriptionById(req: AuthRequest, res: Response) {
    const prescription = await this.getPrescriptionByIdUseCase.execute(
      req.params.id
    );
    return ResponseFormatter.success(
      res,
      prescription,
      "Prescription retrieved successfully"
    );
  }

  async getPrescriptionsByPatientId(req: AuthRequest, res: Response) {
    const prescriptions = await this.getPrescriptionsByPatientIdUseCase.execute(
      req.params.patientId
    );
    return ResponseFormatter.success(
      res,
      prescriptions,
      "Patient prescriptions retrieved successfully"
    );
  }

  async updatePrescription(req: AuthRequest, res: Response) {
    const prescription = await this.updatePrescriptionUseCase.execute(
      req.params.id,
      req.body
    );
    return ResponseFormatter.success(
      res,
      prescription,
      "Prescription updated successfully"
    );
  }

  async deletePrescription(req: AuthRequest, res: Response) {
    await this.deletePrescriptionUseCase.execute(req.params.id);
    return ResponseFormatter.success(
      res,
      null,
      "Prescription deleted successfully"
    );
  }
}
