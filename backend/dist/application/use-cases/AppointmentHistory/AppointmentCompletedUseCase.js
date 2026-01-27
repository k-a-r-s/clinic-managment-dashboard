"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentCompletedUseCase = void 0;
class AppointmentCompletedUseCase {
    constructor(appointmentHistoryRepository, medicalFileRepository, getMedicalFileByPatientIdUseCase, createMedicalFileUseCase) {
        this.appointmentHistoryRepository = appointmentHistoryRepository;
        this.medicalFileRepository = medicalFileRepository;
        this.getMedicalFileByPatientIdUseCase = getMedicalFileByPatientIdUseCase;
        this.createMedicalFileUseCase = createMedicalFileUseCase;
    }
    async execute(data, appointmentId) {
        // the process :
        // 1 - if the patient does not have a medical file , we create
        //  one for him and we stop
        // 2 - it the patient already has one ,
        //  we first store it in history and then update the medical file
        const medicalFile = await this.getMedicalFileByPatientIdUseCase.execute(data.patientId);
        if (!medicalFile) {
            // create a new medical file for the patient
            await this.createMedicalFileUseCase.execute(data);
            return;
        }
        // store the current medical file data in history
        await this.appointmentHistoryRepository.addAppointmentHistory(appointmentId, medicalFile.data);
        // update the medical file with new data
        await this.medicalFileRepository.updateMedicalFile(medicalFile.id, data.data, data.doctorId);
    }
}
exports.AppointmentCompletedUseCase = AppointmentCompletedUseCase;
