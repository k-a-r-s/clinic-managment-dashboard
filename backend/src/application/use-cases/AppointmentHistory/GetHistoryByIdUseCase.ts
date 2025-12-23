import { IAppointmentHistoryRepository } from '../../../domain/repositories/IAppointmentHistoryRepository';
import { AppointmentHistory } from '../../../domain/entities/AppointmentHistory';
import { MedicalData } from '../../../domain/entities/MedicalFile';

export class GetHistoryByIdUseCase {
    constructor(private appointmentHistoryRepository: IAppointmentHistoryRepository) {}

    async execute(historyId: string): Promise<AppointmentHistory | null> {
        return await this.appointmentHistoryRepository.getHistoryByHistoryId(historyId);
    }
}
