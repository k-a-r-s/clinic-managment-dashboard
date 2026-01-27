"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrescriptionUseCase = void 0;
class CreatePrescriptionUseCase {
    constructor(prescriptionRepository, medicalFileRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(data) {
        const prescription = await this.prescriptionRepository.createPrescription(data);
        // Update medical file with prescription history
        try {
            const medicalFile = await this.medicalFileRepository.getMedicalFileByPatientId(data.patientId);
            if (medicalFile) {
                const existingPrescriptions = medicalFile.data?.prescriptions || [];
                const prescriptionRecord = {
                    id: prescription.id,
                    date: prescription.prescriptionDate,
                    doctorId: prescription.doctorId,
                    medications: prescription.medications.map((med) => ({
                        name: med.medicationName,
                        dosage: med.dosage,
                        frequency: med.frequency,
                        duration: med.duration,
                        notes: med.notes,
                    })),
                };
                await this.medicalFileRepository.updateMedicalFile(medicalFile.id, {
                    prescriptions: [...existingPrescriptions, prescriptionRecord],
                    lastUpdated: new Date().toISOString(),
                });
            }
        }
        catch (error) {
            console.error("Failed to update medical file with prescription:", error);
            // Don't fail the prescription creation if medical file update fails
        }
        return prescription;
    }
}
exports.CreatePrescriptionUseCase = CreatePrescriptionUseCase;
