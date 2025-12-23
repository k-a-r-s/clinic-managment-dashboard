import { AppointmentHistory } from "../entities/AppointmentHistory";

export interface IAppointmentHistoryRepository {
    getHistoryByAppointmentId(appointmentId: string): Promise<AppointmentHistory | null>;
    addAppointmentHistory(appointmentId: string, appointmentData: any): Promise<AppointmentHistory>;
    getHistoryByHistoryId(historyId: string): Promise<AppointmentHistory | null>;
    updateAppointmentHistory(appointmentId: string, appointmentData: any): Promise<AppointmentHistory>;
    deleteAppointmentHistory(appointmentId: string): Promise<void>;
    getHistoriesByPatientId(patientId: string): Promise<AppointmentHistory[]>;
}