"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrescriptionsUseCase = void 0;
class GetPrescriptionsUseCase {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    async execute() {
        return this.prescriptionRepository.getPrescriptions();
    }
}
exports.GetPrescriptionsUseCase = GetPrescriptionsUseCase;
