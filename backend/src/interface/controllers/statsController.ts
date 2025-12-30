import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GetDashboardStatsUseCase } from '../../application/use-cases/stats/GetDashboardStatsUseCase';
import { ResponseFormatter } from '../utils/ResponseFormatter';

export class StatsController {
  constructor(private getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

  async getStats(_req: AuthRequest, res: Response) {
    const result = await this.getDashboardStatsUseCase.execute();
    return ResponseFormatter.success(res, result, 'Dashboard stats retrieved successfully');
  }
}
