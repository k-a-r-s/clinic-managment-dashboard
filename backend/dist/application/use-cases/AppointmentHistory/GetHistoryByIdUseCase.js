"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHistoryByIdUseCase = void 0;
class GetHistoryByIdUseCase {
    constructor(appointmentHistoryRepository) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
    }
    async execute(historyId) {
        return await this.appointmentHistoryRepository.getHistoryByHistoryId(historyId);
    }
}
exports.GetHistoryByIdUseCase = GetHistoryByIdUseCase;
