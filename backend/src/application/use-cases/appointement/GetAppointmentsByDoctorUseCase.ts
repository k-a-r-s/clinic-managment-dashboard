import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";

export class GetAppointmentsByDoctorUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(doctorId: string, view: "year" | "month" | "week" | "day") {
        return this.appointementRepository.getAppointementsByDoctorId(doctorId, view);
    }
}