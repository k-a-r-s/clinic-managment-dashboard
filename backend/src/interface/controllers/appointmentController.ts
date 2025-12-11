import { AddAppointementUseCase } from "../../application/use-cases/appointement/AddAppointementUseCase";
import { GetAppointementsUseCase } from "../../application/use-cases/appointement/GetAppointementsUseCase";
import { GetAppointmentsByDoctorUseCase } from "../../application/use-cases/appointement/GetAppointmentsByDoctorUseCase";
import { GetAppointementsByPatientUseCase } from "../../application/use-cases/appointement/GetAppointementsByPatientUseCase";
import { deleteAppointementUseCase } from "../../application/use-cases/appointement/DeleteAppointmentUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";

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
        return response.status(201).json({ message: "Appointment created successfully" });
    }

    async getAllAppointments(request: AuthRequest, response: Response) {
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsUseCase.execute(view as "year" | "month" | "week" | "day");
        return response.status(200).json(appointments);
    }

    async getAppointmentsByDoctor(request: AuthRequest, response: Response) {
        const { doctorId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByDoctorUseCase.execute(doctorId, view as "year" | "month" | "week" | "day");
        return response.status(200).json(appointments);
    }

    async getAppointmentsByPatient(request: AuthRequest, response: Response) {
        const { patientId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByPatientUseCase.execute(patientId, view as "year" | "month" | "week" | "day");
        return response.status(200).json(appointments);
    }

    async deleteAppointment(request: AuthRequest, response: Response) {
        const { appointmentId } = request.params;
        await this.deleteAppointementUseCase.execute(appointmentId);
        return response.status(200).json({ message: "Appointment deleted successfully" });
    }
}