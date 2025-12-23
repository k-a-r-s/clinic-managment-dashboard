import { IAppointmentHistoryRepository } from '../../../domain/repositories/IAppointmentHistoryRepository';
import { AppointmentHistory } from '../../../domain/entities/AppointmentHistory';
import { IAppointementsRepository } from '../../../domain/repositories/IAppointementRepository';

export class GetAppointmentHistoryforPatientUseCase {
    constructor(private appointmentHistoryRepository: IAppointmentHistoryRepository
        , private appointmentRepository: IAppointementsRepository
    ) { }

    async execute(patientId: string): Promise<AppointmentHistory | null> {
        // First, get the appointment for the patient
        const appointments = await this.appointmentRepository.getAppointmentsByPatientId(patientId, "all" as any);
        
        if (!appointments || appointments.length === 0) {
            return null;
        }
        
        // Get the first appointment's history
        return await this.appointmentHistoryRepository.getHistoryByAppointmentId(appointments[0].id);
    }
}
