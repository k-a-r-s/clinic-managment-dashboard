"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSession = void 0;
const uuid_1 = require("uuid");
const DialysisSession_1 = require("../../../domain/entities/DialysisSession");
class CreateSession {
    constructor(dialysisRepository, medicalFileRepository) {
        this.dialysisRepository = dialysisRepository;
        this.medicalFileRepository = medicalFileRepository;
    }
    async execute(data) {
        const session = new DialysisSession_1.DialysisSession({
            id: (0, uuid_1.v4)(),
            dialysisPatientId: data.dialysisPatientId,
            sessionDate: new Date(data.sessionDate),
            durationMinutes: data.durationMinutes,
            completed: data.completed || false,
            complications: data.complications,
            notes: data.notes,
        });
        const createdSession = await this.dialysisRepository.createSession(session);
        // Update medical file with dialysis session history
        try {
            // Get the dialysis patient to find the patient ID
            const dialysisPatient = await this.dialysisRepository.getDialysisPatientById(data.dialysisPatientId);
            if (dialysisPatient) {
                const medicalFile = await this.medicalFileRepository.getMedicalFileByPatientId(dialysisPatient.getPatientId());
                if (medicalFile) {
                    const existingSessions = medicalFile.data?.dialysisSessions || [];
                    const sessionRecord = {
                        id: createdSession.getId(),
                        date: createdSession.getSessionDate(),
                        duration: createdSession.getDurationMinutes(),
                        completed: createdSession.getCompleted(),
                        complications: createdSession.getComplications(),
                        notes: createdSession.getNotes(),
                    };
                    await this.medicalFileRepository.updateMedicalFile(medicalFile.id, {
                        dialysisSessions: [...existingSessions, sessionRecord],
                        lastUpdated: new Date().toISOString(),
                    });
                }
            }
        }
        catch (error) {
            console.error("Failed to update medical file with dialysis session:", error);
            // Don't fail the session creation if medical file update fails
        }
        return createdSession;
    }
}
exports.CreateSession = CreateSession;
