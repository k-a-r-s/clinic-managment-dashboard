import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetDoctorsListUseCase } from "../../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../../application/use-cases/doctors/getDoctorUseCase";
import { DeleteDoctorByIdUseCase } from "../../application/use-cases/doctors/DeleteDoctorByIdUseCase";
import { UpdateDoctorByIdUseCase } from "../../application/use-cases/doctors/updateDoctorByIdUseCase";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class DoctorController {
  constructor(
    private getDoctorsUseCase: GetDoctorsListUseCase,
    private deleteDoctorUseCase: DeleteDoctorByIdUseCase,
    private getDoctorUseCase: GetDoctorUseCase,
    private updateDoctorByIdUseCase: UpdateDoctorByIdUseCase
  ) {}

  async getDoctors(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.getDoctorsUseCase.execute(page, limit);
    return ResponseFormatter.success(res, response, "Doctors retrieved successfully");
  }
  async getDoctorByid(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.getDoctorUseCase.execute(id);
    return ResponseFormatter.success(res, response, "Doctor retrieved successfully");
  }
  async deleteDoctorById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    await this.deleteDoctorUseCase.execute(id);
    return ResponseFormatter.success(res, null, "Doctor deleted successfully");
  }
  async updateDoctorById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.updateDoctorByIdUseCase.execute(id, req.body);
    return ResponseFormatter.success(res, response, "Doctor updated successfully");
  }
}
