"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentHistoryforPatientUseCase = void 0;
class GetAppointmentHistoryforPatientUseCase {
    constructor(appointmentHistoryRepository, appointmentRepository) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
        this.appointmentRepository = appointmentRepository;
    }
    async execute(patientId) {
        // First, get the appointment for the patient
        const appointments = await this.appointmentRepository.getAppointmentsByPatientId(patientId, "all");
        if (!appointments || appointments.length === 0) {
            return null;
        }
        // Get the first appointment's history
        return await this.appointmentHistoryRepository.getHistoryByAppointmentId(appointments[0].id);
    }
}
exports.GetAppointmentHistoryforPatientUseCase = GetAppointmentHistoryforPatientUseCase;
