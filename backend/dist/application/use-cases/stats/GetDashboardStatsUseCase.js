"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardStatsUseCase = void 0;
const date_fns_1 = require("date-fns");
class GetDashboardStatsUseCase {
    constructor(patientRepository, appointementRepository, machineRepository, userRepository) {
        this.patientRepository = patientRepository;
        this.appointementRepository = appointementRepository;
        this.machineRepository = machineRepository;
        this.userRepository = userRepository;
    }
    async execute() {
        const totalPatients = await this.patientRepository.getPatientsCount();
        const todaysAppointments = await this.appointementRepository.getAppointements('day');
        // active sessions: appointments scheduled for today (case-insensitive)
        const activeSessions = (todaysAppointments || []).filter((a) => String(a.status).toLowerCase() === 'scheduled').length;
        const machineStats = await this.machineRepository.getMachineStats();
        const activemachines = (machineStats.total || 0) - (machineStats.outOfService || 0);
        const staffCounts = await this.userRepository.countStaff();
        const staffCount = staffCounts.total;
        const staffSublabel = `${staffCounts.doctors} doctors, ${staffCounts.receptionists} receptionists`;
        const patientsThisWeek = await this.patientRepository.getPatientsCount('week');
        const appointmentsThisWeek = (await this.appointementRepository.getAppointements('week')).length;
        // Per-day breakdown for the current week (Monday -> Sunday)
        const now = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }).map((_, i) => (0, date_fns_1.addDays)(weekStart, i));
        const patientsCreated = await this.patientRepository.getPatientsCreated('week');
        const appointmentsWeek = await this.appointementRepository.getAppointements('week');
        const patientsPerDay = days.map((d) => {
            const key = (0, date_fns_1.format)(d, 'yyyy-MM-dd');
            const count = patientsCreated.filter((p) => (0, date_fns_1.format)(new Date(p.createdAt), 'yyyy-MM-dd') === key).length;
            return { date: key, count };
        });
        const appointmentsPerDay = days.map((d) => {
            const key = (0, date_fns_1.format)(d, 'yyyy-MM-dd');
            const count = appointmentsWeek.filter((a) => (0, date_fns_1.format)(new Date(a.appointmentDate), 'yyyy-MM-dd') === key).length;
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
exports.GetDashboardStatsUseCase = GetDashboardStatsUseCase;
