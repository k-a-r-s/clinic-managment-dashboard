import { IAppointmentHistoryRepository } from '../../../domain/repositories/IAppointmentHistoryRepository';
import { AppointmentHistory } from '../../../domain/entities/AppointmentHistory';

export class UpdateAppointmentHistoryUseCase {
    constructor(private appointmentHistoryRepository: IAppointmentHistoryRepository) {}

    async execute(appointmentId: string, appointmentData: any): Promise<AppointmentHistory> {
        return await this.appointmentHistoryRepository.updateAppointmentHistory(appointmentId, appointmentData);
    }
}
