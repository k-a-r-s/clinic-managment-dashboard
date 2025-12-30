import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GetDashboardStatsUseCase } from '../../application/use-cases/stats/GetDashboardStatsUseCase';
import { GetPatientsPerDayUseCase } from '../../application/use-cases/stats/GetPatientsPerDayUseCase';
import { GetAppointmentsPerDayUseCase } from '../../application/use-cases/stats/GetAppointmentsPerDayUseCase';
import { ResponseFormatter } from '../utils/ResponseFormatter';

export class StatsController {
  constructor(
    private getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private getPatientsPerDayUseCase?: GetPatientsPerDayUseCase,
    private getAppointmentsPerDayUseCase?: GetAppointmentsPerDayUseCase
  ) {}

  async getStats(_req: AuthRequest, res: Response) {
    const result = await this.getDashboardStatsUseCase.execute();
    return ResponseFormatter.success(res, result, 'Dashboard stats retrieved successfully');
  }

  async getPatientsPerDay(_req: AuthRequest, res: Response) {
    if (!this.getPatientsPerDayUseCase) {
      return ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Patients per day stats not available' }, 500, 'Patients per day stats not available');
    }
    const result = await this.getPatientsPerDayUseCase.execute();
    return ResponseFormatter.success(res, result, 'Patients per-day stats retrieved successfully');
  }

  async getAppointmentsPerDay(_req: AuthRequest, res: Response) {
    if (!this.getAppointmentsPerDayUseCase) {
      return ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Appointments per day stats not available' }, 500, 'Appointments per day stats not available');
    }
    const result = await this.getAppointmentsPerDayUseCase.execute();
    return ResponseFormatter.success(res, result, 'Appointments per-day stats retrieved successfully');
  }

  async getSummary(_req: AuthRequest, res: Response) {
    const full = await this.getDashboardStatsUseCase.execute();
    // pick summary fields only
    const { totalPatients, activeSessions, activemachines, staffCount, staffSublabel, patientsThisWeek, appointmentsThisWeek } = full as any;
    return ResponseFormatter.success(res, { totalPatients, activeSessions, activemachines, staffCount, staffSublabel, patientsThisWeek, appointmentsThisWeek }, 'Stats summary retrieved successfully');
  }
}
