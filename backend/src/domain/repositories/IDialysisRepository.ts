import { DialysisPatient, DialysisPatientProps } from "../entities/DialysisPatient";
import { DialysisProtocol, DialysisProtocolProps } from "../entities/DialysisProtocol";
import { DialysisSession, DialysisSessionProps } from "../entities/DialysisSession";

export interface IDialysisRepository {
  // Dialysis Patients
  createDialysisPatient(patient: DialysisPatient): Promise<DialysisPatient>;
  getDialysisPatientById(id: string): Promise<DialysisPatient | null>;
  getAllDialysisPatients(filters?: {
    status?: string;
  }): Promise<DialysisPatient[]>;
  updateDialysisPatient(
    id: string,
    data: Partial<DialysisPatientProps>
  ): Promise<DialysisPatient>;
  deleteDialysisPatient(id: string): Promise<void>;

  // Dialysis Protocols
  createProtocol(protocol: DialysisProtocol): Promise<DialysisProtocol>;
  getProtocolByPatientId(
    dialysisPatientId: string
  ): Promise<DialysisProtocol | null>;
  updateProtocol(
    id: string,
    data: Partial<DialysisProtocolProps>
  ): Promise<DialysisProtocol>;
  deleteProtocol(id: string): Promise<void>;

  // Dialysis Sessions
  createSession(session: DialysisSession): Promise<DialysisSession>;
  getSessionById(id: string): Promise<DialysisSession | null>;
  getSessionsByPatientId(dialysisPatientId: string): Promise<DialysisSession[]>;
  updateSession(
    id: string,
    data: Partial<DialysisSessionProps>
  ): Promise<DialysisSession>;
  deleteSession(id: string): Promise<void>;
}
