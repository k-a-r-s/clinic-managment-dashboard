"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsByDoctorUseCase = void 0;
class GetAppointmentsByDoctorUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute(doctorId, view) {
        return this.appointementRepository.getAppointementsByDoctorId(doctorId, view);
    }
}
exports.GetAppointmentsByDoctorUseCase = GetAppointmentsByDoctorUseCase;
