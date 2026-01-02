import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { UpdateAppointmentDto } from "../../dto/requests/updateAppointmentDto";

export class UpdateAppointmentUseCase {
  constructor(private appointmentRepository: IAppointementsRepository) {}

  async execute(
    appointmentId: string,
    updateData: UpdateAppointmentDto
  ): Promise<null> {
    // Verify appointment exists
    const appointment = await this.appointmentRepository.getAppointmentById(
      appointmentId
    );
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // Perform update
    return this.appointmentRepository.updateAppointment(
      appointmentId,
      updateData
    );
  }
}
