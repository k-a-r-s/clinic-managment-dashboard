import { Response } from "express";
import { AddPatientUseCase } from "../../application/use-cases/patients/addPatientUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetPatientByIdUseCase } from "../../application/use-cases/patients/getPatientByIdUseCase";
import { DeletePatientByIdUseCase } from "../../application/use-cases/patients/deletePatientByIdUseCase";
import { GetAllPatientsUseCase } from "../../application/use-cases/patients/getAllPatientsUseCase";
import { UpdatePatientUseCase } from "../../application/use-cases/patients/UpdatePatientUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";
export class PatientController {
  constructor(
    private addPatientUseCase: AddPatientUseCase,
    private getPatientByIdUseCase: GetPatientByIdUseCase,
    private deletePatientByIdUseCase: DeletePatientByIdUseCase,
    private getAllPatientsUseCase: GetAllPatientsUseCase,
    private updatePatientUseCase: UpdatePatientUseCase
  ) {}
  async addPatient(req: AuthRequest, res: Response) {
    const { body } = req;
    const result = await this.addPatientUseCase.execute({ ...body });
    console.log(result);
    return ResponseFormatter.success(res, result, "Patient created successfully", 201);
  }
  async getPatientById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.getPatientByIdUseCase.execute(id);
    console.log(result);
    return ResponseFormatter.success(res, result, "Patient retrieved successfully");
  }
  async deletePatientById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.deletePatientByIdUseCase.execute(id);
    console.log(result);
    return ResponseFormatter.success(res, null, "Patient deleted successfully");
  }
  async getAllPatients(req: AuthRequest, res: Response) {
    const result = await this.getAllPatientsUseCase.execute();
    return ResponseFormatter.success(res, result, "Patients retrieved successfully");
  }
  async updatePatient(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const result = await this.updatePatientUseCase.execute(id, body);
    return ResponseFormatter.success(res, result, "Patient updated successfully");
  }
}
