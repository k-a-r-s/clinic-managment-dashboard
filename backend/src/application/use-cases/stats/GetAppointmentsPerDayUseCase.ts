import { IAppointementsRepository } from '../../../domain/repositories/IAppointementRepository';
import { startOfWeek, addDays, format } from 'date-fns';

export class GetAppointmentsPerDayUseCase {
  constructor(private appointementRepository: IAppointementsRepository) {}

  async execute() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const appointmentsWeek = await this.appointementRepository.getAppointements('week');

    const appointmentsPerDay = days.map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      const count = appointmentsWeek.filter((a: any) => format(new Date(a.appointmentDate), 'yyyy-MM-dd') === key).length;
      return { date: key, count };
    });

    return appointmentsPerDay;
  }
}
