import { Appointement } from "../entities/Appointement";
import { GetAppointmentByIdResponseDto } from "../../application/dto/responses/appointments/getAppointment";

export interface IAppointementsRepository {
    addAppointement(appointementData: Appointement): Promise<null>;
    deleteAppointement(appointementId: string): Promise<null>;
    getAppointmentById(appointmentId: string): Promise<GetAppointmentByIdResponseDto | null>;
    getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day"
    ): Promise<Appointement[]>;
    getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day"): Promise<Appointement[]>;
    getAppointements(
        view: "year" | "month" | "week" | "day",
        filters?: { patientName?: string; doctorName?: string }
    ): Promise<Appointement[]>;
}