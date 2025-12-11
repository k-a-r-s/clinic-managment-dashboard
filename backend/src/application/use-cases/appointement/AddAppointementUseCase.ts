import { id } from "zod/v4/locales";
import { Appointement } from "../../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";
import { AddAppointmentDto } from "../../dto/requests/addAppointementDto";
import { UUID } from "crypto";
import { status } from "../../../domain/entities/Appointement";
export class AddAppointementUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(addAppointmentDto: AddAppointmentDto): Promise<null> {
        const appointement = new Appointement(
            crypto.randomUUID(),
            addAppointmentDto.patientId as UUID,
            addAppointmentDto.doctorId as UUID,
            addAppointmentDto.roomId as UUID,
            addAppointmentDto.createdByReceptionId as UUID | null,
            addAppointmentDto.createdByDoctorId as UUID | null,
            addAppointmentDto.appointmentDate,
            addAppointmentDto.estimatedDurationInMinutes,
            status[addAppointmentDto.status],
        );

        return this.appointementRepository.addAppointement(appointement);
    }
}