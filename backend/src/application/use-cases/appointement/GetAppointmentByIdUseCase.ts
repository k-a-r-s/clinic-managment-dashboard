import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";

export class GetAppointmentByIdUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(appointmentId: string) {
        return this.appointementRepository.getAppointmentById(appointmentId);
    }
}
