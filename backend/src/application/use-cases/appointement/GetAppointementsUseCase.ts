import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";

export class GetAppointementsUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(view: "year" | "month" | "week" | "day") {
        return this.appointementRepository.getAppointements(view);
    }
}