"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointementsByPatientUseCase = void 0;
class GetAppointementsByPatientUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute(patientId, view) {
        return this.appointementRepository.getAppointmentsByPatientId(patientId, view);
    }
}
exports.GetAppointementsByPatientUseCase = GetAppointementsByPatientUseCase;
