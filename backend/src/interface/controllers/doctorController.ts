import { Request, Response } from "express";
import { ApiResponse } from "../../application/dto/responses/ApiResponse";
import { success } from "zod";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetDoctorsListUseCase } from "../../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../../application/use-cases/doctors/getDoctorUseCase";
import { DeleteDoctorByIdUseCase } from "../../application/use-cases/doctors/DeleteDoctorByIdUseCase";
import { UpdateDoctorByIdUseCase } from "../../application/use-cases/doctors/updateDoctorByIdUseCase";

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
    res.status(200).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
  async getDoctorByid(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.getDoctorUseCase.execute(id);
    res.status(200).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
  async deleteDoctorById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    await this.deleteDoctorUseCase.execute(id);
    res.status(200).json({
      success: true,
      status: res.status,
      data: null,
      error: null,
    });
  }
  async updateDoctorById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.updateDoctorByIdUseCase.execute(id, req.body);
    res.status(200).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
}
