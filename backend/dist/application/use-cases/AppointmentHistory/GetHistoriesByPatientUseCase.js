"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHistoriesByPatientUseCase = void 0;
class GetHistoriesByPatientUseCase {
    constructor(appointmentHistoryRepository) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
    }
    async execute(patientId) {
        return await this.appointmentHistoryRepository.getHistoriesByPatientId(patientId);
    }
}
exports.GetHistoriesByPatientUseCase = GetHistoriesByPatientUseCase;
