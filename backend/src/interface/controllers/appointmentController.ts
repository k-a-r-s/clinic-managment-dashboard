import { AddAppointementUseCase } from "../../application/use-cases/appointement/AddAppointementUseCase";
import { GetAppointementsUseCase } from "../../application/use-cases/appointement/GetAppointementsUseCase";
import { GetAppointmentsByDoctorUseCase } from "../../application/use-cases/appointement/GetAppointmentsByDoctorUseCase";
import { GetAppointementsByPatientUseCase } from "../../application/use-cases/appointement/GetAppointementsByPatientUseCase";
import { deleteAppointementUseCase } from "../../application/use-cases/appointement/DeleteAppointmentUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class AppointementController {
    constructor(
        private addAppointementUseCase: AddAppointementUseCase,
        private getAppointementsUseCase: GetAppointementsUseCase,
        private getAppointementsByDoctorUseCase: GetAppointmentsByDoctorUseCase,
        private getAppointementsByPatientUseCase: GetAppointementsByPatientUseCase,
        private deleteAppointementUseCase: deleteAppointementUseCase
    ) { }

    async createAppointment(request: AuthRequest, response: Response) {
        const { body } = request;
        await this.addAppointementUseCase.execute(body);
        return ResponseFormatter.success(response, null, "Appointment created successfully", 201);
    }

    async getAllAppointments(request: AuthRequest, response: Response) {
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsUseCase.execute(view as "year" | "month" | "week" | "day");
        return ResponseFormatter.success(response, appointments, "Appointments retrieved successfully");
    }

    async getAppointmentsByDoctor(request: AuthRequest, response: Response) {
        const { doctorId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByDoctorUseCase.execute(doctorId, view as "year" | "month" | "week" | "day");
        return ResponseFormatter.success(response, appointments, "Doctor appointments retrieved successfully");
    }

    async getAppointmentsByPatient(request: AuthRequest, response: Response) {
        const { patientId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByPatientUseCase.execute(patientId, view as "year" | "month" | "week" | "day");
        return ResponseFormatter.success(response, appointments, "Patient appointments retrieved successfully");
    }

    async deleteAppointment(request: AuthRequest, response: Response) {
        const { appointmentId } = request.params;
        await this.deleteAppointementUseCase.execute(appointmentId);
        return ResponseFormatter.success(response, null, "Appointment deleted successfully");
    }
}