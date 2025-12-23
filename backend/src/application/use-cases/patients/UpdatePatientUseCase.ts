import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { UpdatePatientDto } from "../../dto/requests/updatePatienDto";
import { Patient } from "../../../domain/entities/Patient";

export class UpdatePatientUseCase {
    constructor(private patientRepository: IPatientRepository) { }

    async execute(id: string, updateData: UpdatePatientDto): Promise<null> {
        const patient = await this.patientRepository.getPatientByid(id);
        if (!patient) {
            throw new Error("Patient not found");
        }

        const updatedPatient = new Patient({
            id: patient.getId(),
            firstName: updateData.firstName ?? patient.getFirstName(),
            lastName: updateData.lastName ?? patient.getLastName(),
            email: updateData.email ?? patient.getEmail(),
            phoneNumber: updateData.phoneNumber ?? patient.getPhoneNumber(),
            birthDate: updateData.birthDate ?? patient.getBirthDate(),
            gender: updateData.gender ?? patient.getGender(),
            address: updateData.address ?? patient.getAddress(),
            profession: updateData.profession ?? patient.getProfession(),
            childrenNumber: updateData.childrenNumber ?? patient.getChildrenNumber(),
            familySituation: updateData.familySituation ?? patient.getFamilySituation(),
            insuranceNumber: updateData.insuranceNumber ?? patient.getInsuranceNumber(),
            emergencyContactName: updateData.emergencyContactName ?? patient.getEmergencyContactName(),
            emergencyContactPhone: updateData.emergencyContactPhone ?? patient.getEmergencyContactPhone(),
            medicalFileId: updateData.medicalFileId ?? patient.getMedicalFileId(),
        });
        
        return this.patientRepository.updatePatient(updatedPatient);
    }
}