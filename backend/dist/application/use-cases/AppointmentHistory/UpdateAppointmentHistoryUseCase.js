"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentHistoryUseCase = void 0;
class UpdateAppointmentHistoryUseCase {
    constructor(appointmentHistoryRepository) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
    }
    async execute(appointmentId, appointmentData) {
        return await this.appointmentHistoryRepository.updateAppointmentHistory(appointmentId, appointmentData);
    }
}
exports.UpdateAppointmentHistoryUseCase = UpdateAppointmentHistoryUseCase;
