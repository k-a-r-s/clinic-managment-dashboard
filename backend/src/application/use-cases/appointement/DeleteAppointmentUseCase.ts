import { IAppointementsRepository } from "../../../domain/repositories/IAppointementRepository";

export class deleteAppointementUseCase {
    constructor(private appointementRepository: IAppointementsRepository) { }

    async execute(appointementId: string): Promise<null> {
        return this.appointementRepository.deleteAppointement(appointementId);
    }
}