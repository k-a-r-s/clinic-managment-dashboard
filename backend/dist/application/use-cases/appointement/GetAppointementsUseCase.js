"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointementsUseCase = void 0;
class GetAppointementsUseCase {
    constructor(appointementRepository) {
        this.appointementRepository = appointementRepository;
    }
    async execute(view, filters) {
        return this.appointementRepository.getAppointements(view, filters);
    }
}
exports.GetAppointementsUseCase = GetAppointementsUseCase;
