import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";

export class GetAppointementsByPatientUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }
    async execute(patientId: string, view: "year" | "month" | "week" | "day") {
        return this.appointementRepository.getAppointmentsByPatientId(patientId, view);
    }
}