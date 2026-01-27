"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointementUseCase = void 0;
class deleteAppointementUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute(appointementId) {
        return this.appointementRepository.deleteAppointement(appointementId);
    }
}
exports.deleteAppointementUseCase = deleteAppointementUseCase;
