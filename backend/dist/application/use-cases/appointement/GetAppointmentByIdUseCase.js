"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentByIdUseCase = void 0;
class GetAppointmentByIdUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute(appointmentId) {
        return this.appointementRepository.getAppointmentById(appointmentId);
    }
}
exports.GetAppointmentByIdUseCase = GetAppointmentByIdUseCase;
