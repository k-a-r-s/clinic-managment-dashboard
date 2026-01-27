"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentHistoryController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class AppointmentHistoryController {
    constructor(getAppointmentHistoryUseCase, getHistoriesByPatientUseCase, updateAppointmentHistoryUseCase, deleteAppointmentHistoryUseCase) {
        this.getAppointmentHistoryUseCase = getAppointmentHistoryUseCase;
        this.getHistoriesByPatientUseCase = getHistoriesByPatientUseCase;
        this.updateAppointmentHistoryUseCase = updateAppointmentHistoryUseCase;
        this.deleteAppointmentHistoryUseCase = deleteAppointmentHistoryUseCase;
    }
    async getHistoryByAppointmentId(req, res) {
        try {
            const { appointmentId } = req.params;
            const history = await this.getAppointmentHistoryUseCase.execute(appointmentId);
            if (!history) {
                ResponseFormatter_1.ResponseFormatter.error(res, { type: 'NOT_FOUND', message: 'Appointment history not found' }, 404, 'Appointment history not found');
                return;
            }
            ResponseFormatter_1.ResponseFormatter.success(res, history.toJson(), 'Appointment history retrieved successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(res, { type: 'FETCH_ERROR', message: String(error) }, 400, 'Failed to retrieve appointment history');
        }
    }
    async updateHistory(req, res) {
        try {
            const { appointmentId } = req.params;
            const { appointmentData } = req.body;
            const updatedHistory = await this.updateAppointmentHistoryUseCase.execute(appointmentId, appointmentData);
            ResponseFormatter_1.ResponseFormatter.success(res, updatedHistory.toJson(), 'Appointment history updated successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(res, { type: 'UPDATE_ERROR', message: String(error) }, 400, 'Failed to update appointment history');
        }
    }
    async deleteHistory(req, res) {
        try {
            const { appointmentId } = req.params;
            await this.deleteAppointmentHistoryUseCase.execute(appointmentId);
            ResponseFormatter_1.ResponseFormatter.success(res, null, 'Appointment history deleted successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(res, { type: 'DELETE_ERROR', message: String(error) }, 400, 'Failed to delete appointment history');
        }
    }
    async getHistoriesByPatientId(req, res) {
        try {
            const { patientId } = req.params;
            const histories = await this.getHistoriesByPatientUseCase.execute(patientId);
            ResponseFormatter_1.ResponseFormatter.success(res, histories.map(h => h.toJson()), 'Appointment histories retrieved successfully', 200);
        }
        catch (error) {
            ResponseFormatter_1.ResponseFormatter.error(res, { type: 'FETCH_ERROR', message: String(error) }, 400, 'Failed to retrieve appointment histories');
        }
    }
}
exports.AppointmentHistoryController = AppointmentHistoryController;
