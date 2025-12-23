import { IPatientRepository } from '../../../domain/repositories/IPatientRepository';
import { IAppointementsRepository } from '../../../domain/repositories/IAppointementRepository';
import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export interface DashboardStats {
  totalPatients: number;
  activeSessions: number;
  activemachines: number;
  staffCount: number;
  staffSublabel: string;
}

export class GetDashboardStatsUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private appointementRepository: IAppointementsRepository,
    private machineRepository: IMachineRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<DashboardStats> {
    const totalPatients = await this.patientRepository.getPatientsCount();

    const todaysAppointments = await this.appointementRepository.getAppointements('day');
    // active sessions: appointments scheduled for today (case-insensitive)
    const activeSessions = (todaysAppointments || []).filter((a: any) =>
      String(a.status).toLowerCase() === 'scheduled'
    ).length;

    const machineStats = await this.machineRepository.getMachineStats();
    const activemachines = (machineStats.total || 0) - (machineStats.outOfService || 0);

    const staffCounts = await this.userRepository.countStaff();
    const staffCount = staffCounts.total;
    const staffSublabel = `${staffCounts.doctors} doctors, ${staffCounts.receptionists} receptionists`;

    return {
      totalPatients,
      activeSessions,
      activemachines,
      staffCount,
      staffSublabel,
    };
  }
}
