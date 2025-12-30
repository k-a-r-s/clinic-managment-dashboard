import { id } from "zod/v4/locales";
import { Appointement } from "../../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { AddAppointmentDto } from "../../dto/requests/addAppointementDto";
import { UUID } from "crypto";
import { status } from "../../../domain/entities/Appointement";
export class AddAppointementUseCase {
    constructor(private appointementRepository: IAppointementsRepository, private roomRepository?: IRoomRepository) { }

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

        // If room repository provided, validate room exists and is available (by id only)
        if (this.roomRepository) {
            const room = await this.roomRepository.getRoomById(String(addAppointmentDto.roomId));
            if (!room) {
                throw new AppError('Room not found', 404);
            }

            const available = await this.roomRepository.isAvailable(String(addAppointmentDto.roomId));
            if (!available) {
                throw new AppError('Room is not available', 409);
            }
        }

        return this.appointementRepository.addAppointement(appointement);
    }
}