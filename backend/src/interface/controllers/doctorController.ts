import { Request, Response } from "express";
import { ApiResponse } from "../../application/dto/responses/ApiResponse";
import { success } from "zod";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetDoctorsListUseCase } from "../../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../../application/use-cases/doctors/getDoctorUseCase";

export class DoctorController {
  constructor(
    private getDoctorsUseCase: GetDoctorsListUseCase,
    private getDoctorUseCase: GetDoctorUseCase
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
}
