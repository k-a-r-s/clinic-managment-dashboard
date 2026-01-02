import { v4 as uuidv4 } from "uuid";
import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { DialysisSession } from "../../../domain/entities/DialysisSession";
import { CreateSessionDto } from "../../dto/requests/dialysis/createSessionDto";

export class CreateSession {
  constructor(
    private dialysisRepository: IDialysisRepository,
    private medicalFileRepository: IMedicalFileRepository
  ) {}

  async execute(data: CreateSessionDto): Promise<DialysisSession> {
    const session = new DialysisSession({
      id: uuidv4(),
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
      const dialysisPatient =
        await this.dialysisRepository.getDialysisPatientById(
          data.dialysisPatientId
        );

      if (dialysisPatient) {
        const medicalFile =
          await this.medicalFileRepository.getMedicalFileByPatientId(
            dialysisPatient.patientId
          );

        if (medicalFile) {
          const existingSessions = medicalFile.data?.dialysisSessions || [];
          const sessionRecord = {
            id: createdSession.id,
            date: createdSession.sessionDate,
            duration: createdSession.durationMinutes,
            completed: createdSession.completed,
            complications: createdSession.complications,
            notes: createdSession.notes,
          };

          await this.medicalFileRepository.updateMedicalFile(medicalFile.id, {
            dialysisSessions: [...existingSessions, sessionRecord],
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error(
        "Failed to update medical file with dialysis session:",
        error
      );
      // Don't fail the session creation if medical file update fails
    }

    return createdSession;
  }
}
