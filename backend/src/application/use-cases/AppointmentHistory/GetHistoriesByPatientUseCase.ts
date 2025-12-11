import { IAppointmentHistoryRepository } from '../../../domain/repositories/IAppointmentHistoryRepository';
import { AppointmentHistory } from '../../../domain/entities/AppointmentHistory';

export class GetHistoriesByPatientUseCase {
    constructor(private appointmentHistoryRepository: IAppointmentHistoryRepository) {}

    async execute(patientId: string): Promise<AppointmentHistory[]> {
        return await this.appointmentHistoryRepository.getHistoriesByPatientId(patientId);
    }
}
