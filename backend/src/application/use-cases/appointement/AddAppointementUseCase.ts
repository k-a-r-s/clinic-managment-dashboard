import { id } from "zod/v4/locales";
import { Appointement } from "../../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";
import { IMedicalFileRepository } from "../../../domain/repositories/IMedicalFileRepository";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { AddAppointmentDto } from "../../dto/requests/addAppointementDto";
import { UUID } from "crypto";
import { status } from "../../../domain/entities/Appointement";
export class AddAppointementUseCase {
  constructor(
    private appointementRepository: IAppointementsRepository,
    private medicalFileRepository: IMedicalFileRepository,
    private roomRepository?: IRoomRepository
  ) {}

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
      status[addAppointmentDto.status]
    );

    // If room repository provided, validate room exists and is available (by id only)
    if (this.roomRepository) {
      const room = await this.roomRepository.getRoomById(
        String(addAppointmentDto.roomId)
      );
      if (!room) {
        throw new AppError("Room not found", 404);
      }

      const available = await this.roomRepository.isAvailable(
        String(addAppointmentDto.roomId)
      );
      if (!available) {
        throw new AppError("Room is not available", 409);
      }
    }

    const result = await this.appointementRepository.addAppointement(
      appointement
    );

    // Update medical file with appointment history
    try {
      const medicalFile =
        await this.medicalFileRepository.getMedicalFileByPatientId(
          addAppointmentDto.patientId
        );

      if (medicalFile) {
        const existingAppointments = medicalFile.data?.appointments || [];
        const appointmentRecord = {
          id: appointement.id,
          date: appointement.appointmentDate,
          doctorId: appointement.doctorId,
          roomId: appointement.roomId,
          status: appointement.status,
          duration: appointement.estimatedDurationInMinutes,
        };

        await this.medicalFileRepository.updateMedicalFile(medicalFile.id, {
          appointments: [...existingAppointments, appointmentRecord],
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to update medical file with appointment:", error);
      // Don't fail the appointment creation if medical file update fails
    }

    return result;
  }
}
