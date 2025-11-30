import { Response } from "express";
import { AddPatientUseCase } from "../../application/use-cases/patients/addPatientUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetPatientByIdUseCase } from "../../application/use-cases/patients/getPatientByIdUseCase";
import { DeletePatientByIdUseCase } from "../../application/use-cases/patients/deletePatientByIdUseCase";
import { GetAllPatientsUseCase } from "../../application/use-cases/patients/getAllPatientsUseCase";
export class PatientController {
  constructor(
    private addPatientUseCase: AddPatientUseCase,
    private getPatientByIdUseCase: GetPatientByIdUseCase,
    private deletePatientByIdUseCase: DeletePatientByIdUseCase,
    private getAllPatientsUseCase: GetAllPatientsUseCase
  ) {}
  async addPatient(req: AuthRequest, res: Response) {
    const { body } = req;
    const result = await this.addPatientUseCase.execute({ ...body });
    console.log(result);
    res.json({
      success: true,
      status: 200,
      data: result,
      error: null,
    });
  }
  async getPatientById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.getPatientByIdUseCase.execute(id);
    console.log(result);
    res.json({
      success: true,
      status: 200,
      data: result,
      error: null,
    });
  }
  async deletePatientById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await this.deletePatientByIdUseCase.execute(id);
    console.log(result);
    res.json({
      success: true,
      status: 200,
      data: null,
      error: null,
    });
  }
  async getAllPatients(req: AuthRequest, res: Response) {
    const result = await this.getAllPatientsUseCase.execute();
    console.log(result);
    res.json({
      success: true,
      status: 200,
      data: result,
      error: null,
    });
  }
}
