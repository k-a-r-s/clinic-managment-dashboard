import { Appointement } from "../entities/Appointement";
import { GetAppointmentByIdResponseDto } from "../../application/dto/responses/appointments/getAppointment";

export interface IAppointementsRepository {
    addAppointement(appointementData: Appointement): Promise<null>;
    deleteAppointement(appointementId: string): Promise<null>;
    getAppointmentById(appointmentId: string): Promise<GetAppointmentByIdResponseDto | null>;
    getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day" | "all"
    ): Promise<any[]>;
    getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day" | "all"): Promise<any[]>;
    getAppointementsByRoomId(roomId: string, view: "year" | "month" | "week" | "day" | "all"): Promise<any[]>;
    getAppointements(
        view: "year" | "month" | "week" | "day" | "all",
        filters?: { patientName?: string; doctorName?: string }
    ): Promise<any[]>;
}