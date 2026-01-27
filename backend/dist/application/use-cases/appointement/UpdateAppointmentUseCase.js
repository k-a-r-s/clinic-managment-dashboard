"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentUseCase = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class UpdateAppointmentUseCase {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async execute(appointmentId, updateData) {
        // Verify appointment exists
        const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            throw new AppError_1.AppError("Appointment not found", 404);
        }
        // Perform update
        return this.appointmentRepository.updateAppointment(appointmentId, updateData);
    }
}
exports.UpdateAppointmentUseCase = UpdateAppointmentUseCase;
