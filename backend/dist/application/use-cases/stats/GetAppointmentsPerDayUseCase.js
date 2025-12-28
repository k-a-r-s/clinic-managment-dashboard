"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsPerDayUseCase = void 0;
const date_fns_1 = require("date-fns");
class GetAppointmentsPerDayUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute() {
        const now = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }).map((_, i) => (0, date_fns_1.addDays)(weekStart, i));
        const appointmentsWeek = await this.appointementRepository.getAppointements('week');
        const appointmentsPerDay = days.map((d) => {
            const key = (0, date_fns_1.format)(d, 'yyyy-MM-dd');
            const count = appointmentsWeek.filter((a) => (0, date_fns_1.format)(new Date(a.appointmentDate), 'yyyy-MM-dd') === key).length;
            return { date: key, count };
        });
        return appointmentsPerDay;
    }
}
exports.GetAppointmentsPerDayUseCase = GetAppointmentsPerDayUseCase;
