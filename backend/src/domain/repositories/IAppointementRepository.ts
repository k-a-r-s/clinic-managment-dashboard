import { Appointement } from "../entities/Appointement";

export interface IAppointementsRepository {
    addAppointement(appointementData: Appointement): Promise<null>;
    deleteAppointement(appointementId: string): Promise<null>;
    getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day"
    ): Promise<Appointement[]>;
    getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day"): Promise<Appointement[]>;
    getAppointements(view: "year" | "month" | "week" | "day"): Promise<Appointement[]>;
}