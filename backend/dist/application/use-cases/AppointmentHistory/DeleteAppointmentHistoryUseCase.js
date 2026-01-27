"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAppointmentHistoryUseCase = void 0;
class DeleteAppointmentHistoryUseCase {
    constructor(appointmentHistoryRepository) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
    }
    async execute(appointmentId) {
        return await this.appointmentHistoryRepository.deleteAppointmentHistory(appointmentId);
    }
}
exports.DeleteAppointmentHistoryUseCase = DeleteAppointmentHistoryUseCase;
