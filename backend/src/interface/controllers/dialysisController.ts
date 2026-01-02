import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { CreateDialysisPatient } from "../../application/use-cases/dialysis/CreateDialysisPatient";
import { GetAllDialysisPatients } from "../../application/use-cases/dialysis/GetAllDialysisPatients";
import { UpdateDialysisPatient } from "../../application/use-cases/dialysis/UpdateDialysisPatient";
import { CreateProtocol } from "../../application/use-cases/dialysis/CreateProtocol";
import { GetProtocolByPatientId } from "../../application/use-cases/dialysis/GetProtocolByPatientId";
import { UpdateProtocol } from "../../application/use-cases/dialysis/UpdateProtocol";
import { CreateSession } from "../../application/use-cases/dialysis/CreateSession";
import { GetSessionsByPatientId } from "../../application/use-cases/dialysis/GetSessionsByPatientId";
import { GetSessionById } from "../../application/use-cases/dialysis/GetSessionById";
import { UpdateSession } from "../../application/use-cases/dialysis/UpdateSession";
import { DeleteSession } from "../../application/use-cases/dialysis/DeleteSession";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class DialysisController {
  constructor(
    private createDialysisPatientUseCase: CreateDialysisPatient,
    private getAllDialysisPatientsUseCase: GetAllDialysisPatients,
    private updateDialysisPatientUseCase: UpdateDialysisPatient,
    private createProtocolUseCase: CreateProtocol,
    private getProtocolByPatientIdUseCase: GetProtocolByPatientId,
    private updateProtocolUseCase: UpdateProtocol,
    private createSessionUseCase: CreateSession,
    private getSessionsByPatientIdUseCase: GetSessionsByPatientId,
    private getSessionByIdUseCase: GetSessionById,
    private updateSessionUseCase: UpdateSession,
    private deleteSessionUseCase: DeleteSession
  ) {}

  // Dialysis Patients
  async createDialysisPatient(req: AuthRequest, res: Response) {
    const result = await this.createDialysisPatientUseCase.execute(req.body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Dialysis patient created successfully",
      201
    );
  }

  async getAllDialysisPatients(req: AuthRequest, res: Response) {
    const { status } = req.query as { status?: string };
    const result = await this.getAllDialysisPatientsUseCase.execute({ status });
    return ResponseFormatter.success(
      res,
      result.map((p) => p.toJson()),
      "Dialysis patients retrieved successfully"
    );
  }

  async updateDialysisPatient(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.updateDialysisPatientUseCase.execute(
      id,
      req.body
    );
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Dialysis patient updated successfully"
    );
  }

  // Protocols
  async createProtocol(req: AuthRequest, res: Response) {
    const result = await this.createProtocolUseCase.execute(req.body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Protocol created successfully",
      201
    );
  }

  async getProtocolByPatientId(req: AuthRequest, res: Response) {
    const { dialysisPatientId } = req.params;
    const result = await this.getProtocolByPatientIdUseCase.execute(
      dialysisPatientId
    );
    if (!result) {
      return ResponseFormatter.error(
        res,
        { type: "NOT_FOUND", message: "Protocol not found for this patient" },
        404,
        "Protocol not found for this patient"
      );
    }
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Protocol retrieved successfully"
    );
  }

  async updateProtocol(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.updateProtocolUseCase.execute(id, req.body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Protocol updated successfully"
    );
  }

  // Sessions
  async createSession(req: AuthRequest, res: Response) {
    const result = await this.createSessionUseCase.execute(req.body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Session created successfully",
      201
    );
  }

  async getSessionsByPatientId(req: AuthRequest, res: Response) {
    const { dialysisPatientId } = req.params;
    const result = await this.getSessionsByPatientIdUseCase.execute(
      dialysisPatientId
    );
    return ResponseFormatter.success(
      res,
      result.map((s) => s.toJson()),
      "Sessions retrieved successfully"
    );
  }

  async getSessionById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.getSessionByIdUseCase.execute(id);
    if (!result) {
      return ResponseFormatter.error(
        res,
        { type: "NOT_FOUND", message: "Session not found" },
        404,
        "Session not found"
      );
    }
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Session retrieved successfully"
    );
  }

  async updateSession(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.updateSessionUseCase.execute(id, req.body);
    return ResponseFormatter.success(
      res,
      result.toJson(),
      "Session updated successfully"
    );
  }

  async deleteSession(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deleteSessionUseCase.execute(id);
    return ResponseFormatter.success(res, null, "Session deleted successfully");
  }
}
