import { AddAppointementUseCase } from "../../application/use-cases/appointement/AddAppointementUseCase";
import { GetAppointementsUseCase } from "../../application/use-cases/appointement/GetAppointementsUseCase";
import { GetAppointmentsByDoctorUseCase } from "../../application/use-cases/appointement/GetAppointmentsByDoctorUseCase";
import { GetAppointementsByPatientUseCase } from "../../application/use-cases/appointement/GetAppointementsByPatientUseCase";
import { deleteAppointementUseCase } from "../../application/use-cases/appointement/DeleteAppointmentUseCase";
import { GetAppointmentByIdUseCase } from "../../application/use-cases/appointement/GetAppointmentByIdUseCase";
import { GetAppointmentHistoryforPatientUseCase } from "../../application/use-cases/AppointmentHistory/GetAppointmentHistoryforPatientUseCase";
import { GetHistoriesByPatientUseCase } from "../../application/use-cases/AppointmentHistory/GetHistoriesByPatientUseCase";
import { UpdateAppointmentHistoryUseCase } from "../../application/use-cases/AppointmentHistory/UpdateAppointmentHistoryUseCase";
import { DeleteAppointmentHistoryUseCase } from "../../application/use-cases/AppointmentHistory/DeleteAppointmentHistoryUseCase";
import { AppointmentCompletedUseCase } from "../../application/use-cases/AppointmentHistory/AppointmentCompletedUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class AppointementController {
    constructor(
        private addAppointementUseCase: AddAppointementUseCase,
        private getAppointementsUseCase: GetAppointementsUseCase,
        private getAppointementsByDoctorUseCase: GetAppointmentsByDoctorUseCase,
        private getAppointementsByPatientUseCase: GetAppointementsByPatientUseCase,
        private deleteAppointementUseCase: deleteAppointementUseCase,
        private getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
        private getAppointmentHistoryUseCase: GetAppointmentHistoryforPatientUseCase,
        private getHistoriesByPatientUseCase: GetHistoriesByPatientUseCase,
        private updateAppointmentHistoryUseCase: UpdateAppointmentHistoryUseCase,
        private deleteAppointmentHistoryUseCase: DeleteAppointmentHistoryUseCase,
        private appointmentCompletedUseCase: AppointmentCompletedUseCase
    ) { }

    async createAppointment(request: AuthRequest, response: Response) {
        const { body } = request;
        await this.addAppointementUseCase.execute(body);
        return ResponseFormatter.success(response, null, "Appointment created successfully", 201);
    }

    async getAllAppointments(request: AuthRequest, response: Response) {
        const { view = "month", patientName, doctorName } = request.query;
        const filters = {
            patientName: patientName as string | undefined,
            doctorName: doctorName as string | undefined
        };
        const appointments = await this.getAppointementsUseCase.execute(view as "year" | "month" | "week" | "day", filters);
        return ResponseFormatter.success(response, appointments, "Appointments retrieved successfully");
    }

    async getAppointmentById(request: AuthRequest, response: Response) {
        const { appointmentId } = request.params;
        const appointment = await this.getAppointmentByIdUseCase.execute(appointmentId);
        
        if (!appointment) {
            return ResponseFormatter.error(response, null, 404, "Appointment not found");
        }
        
        return ResponseFormatter.success(response, appointment, "Appointment retrieved successfully");
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

    async getHistoryByAppointmentId(request: AuthRequest, response: Response) {
        try {
            const { appointmentId } = request.params;
            const history = await this.getAppointmentHistoryUseCase.execute(appointmentId);
            
            if (!history) {
                ResponseFormatter.error(
                    response,
                    { type: 'NOT_FOUND', message: 'Appointment history not found' },
                    404,
                    'Appointment history not found'
                );
                return;
            }

            ResponseFormatter.success(
                response,
                history.toJson(),
                'Appointment history retrieved successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                response,
                { type: 'FETCH_ERROR', message: String(error) },
                400,
                'Failed to retrieve appointment history'
            );
        }
    }

    async getHistoriesByPatientId(request: AuthRequest, response: Response) {
        try {
            const { patientId } = request.params;
            const histories = await this.getHistoriesByPatientUseCase.execute(patientId);

            ResponseFormatter.success(
                response,
                histories.map(h => h.toJson()),
                'Appointment histories retrieved successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                response,
                { type: 'FETCH_ERROR', message: String(error) },
                400,
                'Failed to retrieve appointment histories'
            );
        }
    }

    async updateHistory(request: AuthRequest, response: Response) {
        try {
            const { appointmentId } = request.params;
            const { appointmentData } = request.body;

            const updatedHistory = await this.updateAppointmentHistoryUseCase.execute(
                appointmentId,
                appointmentData
            );

            ResponseFormatter.success(
                response,
                updatedHistory.toJson(),
                'Appointment history updated successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                response,
                { type: 'UPDATE_ERROR', message: String(error) },
                400,
                'Failed to update appointment history'
            );
        }
    }

    async deleteHistory(request: AuthRequest, response: Response) {
        try {
            const { appointmentId } = request.params;
            await this.deleteAppointmentHistoryUseCase.execute(appointmentId);

            ResponseFormatter.success(
                response,
                null,
                'Appointment history deleted successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                response,
                { type: 'DELETE_ERROR', message: String(error) },
                400,
                'Failed to delete appointment history'
            );
        }
    }

    async completeAppointment(request: AuthRequest, response: Response) {
        try {
            const { appointmentId } = request.params;
            let { appointmentData, patientId, doctorId } = request.body;
            
            // If patientId and doctorId are not provided, they should be included in the request
            // Otherwise, you would need to fetch them from the appointment
            if (!patientId || !doctorId) {
                ResponseFormatter.error(
                    response,
                    { type: 'VALIDATION_ERROR', message: 'patientId and doctorId are required' },
                    400,
                    'patientId and doctorId are required in request body'
                );
                return;
            }
            
            const medicalFileData = {
                patientId,
                doctorId,
                data: appointmentData || {}
            };
            
            await this.appointmentCompletedUseCase.execute(medicalFileData, appointmentId);

            ResponseFormatter.success(
                response,
                null,
                'Appointment completed and history recorded successfully',
                200
            );
        } catch (error) {
            ResponseFormatter.error(
                response,
                { type: 'COMPLETION_ERROR', message: String(error) },
                400,
                'Failed to complete appointment'
            );
        }
    }
}