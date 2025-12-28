import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";
import { GetAppointmentByIdResponseDto } from "../../dto/responses/appointments/getAppointment";

export class GetAppointmentByIdUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(appointmentId: string): Promise<GetAppointmentByIdResponseDto | null> {
        return this.appointementRepository.getAppointmentById(appointmentId);
    }
}
