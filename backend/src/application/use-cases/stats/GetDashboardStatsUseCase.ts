import { IPatientRepository } from '../../../domain/repositories/IPatientRepository';
import { IAppointementsRepository } from '../../../domain/repositories/IAppointementRepository';
import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { startOfWeek, addDays, format } from 'date-fns';

export interface DashboardStats {
  totalPatients: number;
  activeSessions: number;
  activemachines: number;
  staffCount: number;
  staffSublabel: string;
  patientsThisWeek: number;
  appointmentsThisWeek: number;
  patientsPerDay: { date: string; count: number }[];
  appointmentsPerDay: { date: string; count: number }[];
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

    const patientsThisWeek = await this.patientRepository.getPatientsCount('week');
    const appointmentsThisWeek = (await this.appointementRepository.getAppointements('week')).length;

    // Per-day breakdown for the current week (Monday -> Sunday)
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const patientsCreated = await this.patientRepository.getPatientsCreated('week');
    const appointmentsWeek = await this.appointementRepository.getAppointements('week');

    const patientsPerDay = days.map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      const count = patientsCreated.filter((p) => format(new Date(p.createdAt), 'yyyy-MM-dd') === key).length;
      return { date: key, count };
    });

    const appointmentsPerDay = days.map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      const count = appointmentsWeek.filter((a: any) => format(new Date(a.appointmentDate), 'yyyy-MM-dd') === key).length;
      return { date: key, count };
    });

    return {
      totalPatients,
      activeSessions,
      activemachines,
      staffCount,
      staffSublabel,
      patientsThisWeek,
      appointmentsThisWeek,
      patientsPerDay,
      appointmentsPerDay,
    };
  }
}
