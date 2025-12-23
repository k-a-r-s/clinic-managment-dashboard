import { IAppointmentHistoryRepository } from '../../../domain/repositories/IAppointmentHistoryRepository';

export class DeleteAppointmentHistoryUseCase {
    constructor(private appointmentHistoryRepository: IAppointmentHistoryRepository) {}

    async execute(appointmentId: string): Promise<void> {
        return await this.appointmentHistoryRepository.deleteAppointmentHistory(appointmentId);
    }
}
