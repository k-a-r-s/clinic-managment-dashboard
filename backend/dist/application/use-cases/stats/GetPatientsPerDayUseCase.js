"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPatientsPerDayUseCase = void 0;
const date_fns_1 = require("date-fns");
class GetPatientsPerDayUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute() {
        const now = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }).map((_, i) => (0, date_fns_1.addDays)(weekStart, i));
        const patientsCreated = await this.patientRepository.getPatientsCreated('week');
        const patientsPerDay = days.map((d) => {
            const key = (0, date_fns_1.format)(d, 'yyyy-MM-dd');
            const count = patientsCreated.filter((p) => (0, date_fns_1.format)(new Date(p.createdAt), 'yyyy-MM-dd') === key).length;
            return { date: key, count };
        });
        return patientsPerDay;
    }
}
exports.GetPatientsPerDayUseCase = GetPatientsPerDayUseCase;
