"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointementController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class AppointementController {
    constructor(addAppointementUseCase, getAppointementsUseCase, getAppointementsByDoctorUseCase, getAppointementsByPatientUseCase, deleteAppointementUseCase, getAppointmentByIdUseCase, getAppointmentHistoryUseCase, getHistoriesByPatientUseCase, updateAppointmentHistoryUseCase, deleteAppointmentHistoryUseCase, appointmentCompletedUseCase) {
        this.addAppointementUseCase = addAppointementUseCase;
        this.getAppointementsUseCase = getAppointementsUseCase;
        this.getAppointementsByDoctorUseCase = getAppointementsByDoctorUseCase;
        this.getAppointementsByPatientUseCase = getAppointementsByPatientUseCase;
        this.deleteAppointementUseCase = deleteAppointementUseCase;
        this.getAppointmentByIdUseCase = getAppointmentByIdUseCase;
        this.getAppointmentHistoryUseCase = getAppointmentHistoryUseCase;
        this.getHistoriesByPatientUseCase = getHistoriesByPatientUseCase;
        this.updateAppointmentHistoryUseCase = updateAppointmentHistoryUseCase;
        this.deleteAppointmentHistoryUseCase = deleteAppointmentHistoryUseCase;
        this.appointmentCompletedUseCase = appointmentCompletedUseCase;
    }
    async createAppointment(request, response) {
        const { body } = request;
        await this.addAppointementUseCase.execute(body);
        return ResponseFormatter_1.ResponseFormatter.success(response, null, "Appointment created successfully", 201);
    }
    async getAllAppointments(request, response) {
        const { view = "month", patientName, doctorName } = request.query;
        const filters = {
            patientName: patientName,
            doctorName: doctorName
        };
        const appointments = await this.getAppointementsUseCase.execute(view, filters);
        return ResponseFormatter_1.ResponseFormatter.success(response, appointments, "Appointments retrieved successfully");
    }
    async getAppointmentById(request, response) {
        const { appointmentId } = request.params;
        const appointment = await this.getAppointmentByIdUseCase.execute(appointmentId);
        if (!appointment) {
            return ResponseFormatter_1.ResponseFormatter.error(response, { type: 'NOT_FOUND', message: 'Appointment not found' }, 404, "Appointment not found");
        }
        return ResponseFormatter_1.ResponseFormatter.success(response, appointment, "Appointment retrieved successfully");
    }
    async getAppointmentsByDoctor(request, response) {
        const { doctorId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByDoctorUseCase.execute(doctorId, view);
        return ResponseFormatter_1.ResponseFormatter.success(response, appointments, "Doctor appointments retrieved successfully");
    }
    async getAppointmentsByPatient(request, response) {
        const { patientId } = request.params;
        const { view = "month" } = request.query;
        const appointments = await this.getAppointementsByPatientUseCase.execute(patientId, view);
        return ResponseFormatter_1.ResponseFormatter.success(response, appointments, "Patient appointments retrieved successfully");
    }
    async deleteAppointment(request, response) {
        const { appointmentId } = request.params;
        await this.deleteAppointementUseCase.execute(appointmentId);
        return ResponseFormatter_1.ResponseFormatter.success(response, null, "Appointment deleted successfully");
    }
    async getHistoryByAppointmentId(request, response) {
        try {
            const { appointmentId } = request.params;
            const history = await this.getAppointmentHistoryUseCase.execute(appointmentId);
            if (!history) {
                ResponseFormatter_1.ResponseFormatter.error(response, { type: 'NOT_FOUND', message: 'Appointment history not found' }, 404, 'Appointment history not found');
                return;
            }
            ResponseFormatter_1.ResponseFormatter.success(response, history.toJson(), 'Appointment history retrieved successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(response, { type: 'FETCH_ERROR', message: String(error) }, 400, 'Failed to retrieve appointment history');
        }
    }
    async getHistoriesByPatientId(request, response) {
        try {
            const { patientId } = request.params;
            const histories = await this.getHistoriesByPatientUseCase.execute(patientId);
            ResponseFormatter_1.ResponseFormatter.success(response, histories.map(h => h.toJson()), 'Appointment histories retrieved successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(response, { type: 'FETCH_ERROR', message: String(error) }, 400, 'Failed to retrieve appointment histories');
        }
    }
    async updateHistory(request, response) {
        try {
            const { appointmentId } = request.params;
            const { appointmentData } = request.body;
            const updatedHistory = await this.updateAppointmentHistoryUseCase.execute(appointmentId, appointmentData);
            ResponseFormatter_1.ResponseFormatter.success(response, updatedHistory.toJson(), 'Appointment history updated successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(response, { type: 'UPDATE_ERROR', message: String(error) }, 400, 'Failed to update appointment history');
        }
    }
    async deleteHistory(request, response) {
        try {
            const { appointmentId } = request.params;
            await this.deleteAppointmentHistoryUseCase.execute(appointmentId);
            ResponseFormatter_1.ResponseFormatter.success(response, null, 'Appointment history deleted successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(response, { type: 'DELETE_ERROR', message: String(error) }, 400, 'Failed to delete appointment history');
        }
    }
    async completeAppointment(request, response) {
        try {
            const { appointmentId } = request.params;
            let { appointmentData, patientId, doctorId } = request.body;
            // If patientId and doctorId are not provided, they should be included in the request
            // Otherwise, you would need to fetch them from the appointment
            if (!patientId || !doctorId) {
                ResponseFormatter_1.ResponseFormatter.error(response, { type: 'VALIDATION_ERROR', message: 'patientId and doctorId are required' }, 400, 'patientId and doctorId are required in request body');
                return;
            }
            const medicalFileData = {
                patientId,
                doctorId,
                data: appointmentData || {}
            };
            await this.appointmentCompletedUseCase.execute(medicalFileData, appointmentId);
            ResponseFormatter_1.ResponseFormatter.success(response, null, 'Appointment completed and history recorded successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(response, { type: 'COMPLETION_ERROR', message: String(error) }, 400, 'Failed to complete appointment');
        }
    }
}
exports.AppointementController = AppointementController;
