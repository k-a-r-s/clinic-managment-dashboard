import { IAppointmentHistoryRepository } from "../../../domain/repositories/IAppointmentHistoryRepository";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { CreateMedicalFileDto } from "../../dto/requests/createMedicalFIleDto";
import { createMedicalFileUseCase } from "../medicalFile/createMedicalFIleUseCase";
import { GetMedicalFileUseCase } from "../medicalFile/GetMedicalFileUseCase";

export class AppointmentCompletedUseCase {
    constructor(
        private appointmentHistoryRepository: IAppointmentHistoryRepository,
        private medicalFileRepository: IMedicalFileRepository,
        private getMedicalFileByPatientIdUseCase: GetMedicalFileUseCase,
        private createMedicalFileUseCase: createMedicalFileUseCase
    ) { }

    async execute(data: CreateMedicalFileDto, appointmentId: string): Promise<void> {
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
        await this.appointmentHistoryRepository.addAppointmentHistory(
            appointmentId,
            medicalFile.data
        );
        // update the medical file with new data
        await this.medicalFileRepository.updateMedicalFile(
            medicalFile.id,
            data.doctorId,
            data.data
        );
    }
}