"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class StatsController {
    constructor(getDashboardStatsUseCase, getPatientsPerDayUseCase, getAppointmentsPerDayUseCase) {
        this.getDashboardStatsUseCase = getDashboardStatsUseCase;
        this.getPatientsPerDayUseCase = getPatientsPerDayUseCase;
        this.getAppointmentsPerDayUseCase = getAppointmentsPerDayUseCase;
    }
    async getStats(_req, res) {
        const result = await this.getDashboardStatsUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, 'Dashboard stats retrieved successfully');
    }
    async getPatientsPerDay(_req, res) {
        if (!this.getPatientsPerDayUseCase) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Patients per day stats not available' }, 500, 'Patients per day stats not available');
        }
        const result = await this.getPatientsPerDayUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, 'Patients per-day stats retrieved successfully');
    }
    async getAppointmentsPerDay(_req, res) {
        if (!this.getAppointmentsPerDayUseCase) {
            return ResponseFormatter_1.ResponseFormatter.error(res, { type: 'InternalServerError', message: 'Appointments per day stats not available' }, 500, 'Appointments per day stats not available');
        }
        const result = await this.getAppointmentsPerDayUseCase.execute();
        return ResponseFormatter_1.ResponseFormatter.success(res, result, 'Appointments per-day stats retrieved successfully');
    }
    async getSummary(_req, res) {
        const full = await this.getDashboardStatsUseCase.execute();
        // pick summary fields only
        const { totalPatients, activeSessions, activemachines, staffCount, staffSublabel, patientsThisWeek, appointmentsThisWeek } = full;
        return ResponseFormatter_1.ResponseFormatter.success(res, { totalPatients, activeSessions, activemachines, staffCount, staffSublabel, patientsThisWeek, appointmentsThisWeek }, 'Stats summary retrieved successfully');
    }
}
exports.StatsController = StatsController;
