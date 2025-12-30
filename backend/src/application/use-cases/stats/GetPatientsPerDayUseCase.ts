import { IPatientRepository } from '../../../domain/repositories/IPatientRepository';
import { startOfWeek, addDays, format } from 'date-fns';

export class GetPatientsPerDayUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const patientsCreated = await this.patientRepository.getPatientsCreated('week');

    const patientsPerDay = days.map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      const count = patientsCreated.filter((p) => format(new Date(p.createdAt), 'yyyy-MM-dd') === key).length;
      return { date: key, count };
    });

    return patientsPerDay;
  }
}
