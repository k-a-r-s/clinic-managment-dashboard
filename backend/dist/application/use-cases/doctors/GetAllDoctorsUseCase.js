"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoctorsListUseCase = void 0;
class GetDoctorsListUseCase {
    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
    async execute(page, limit) {
        const offset = (page - 1) * limit;
        return this.doctorRepository.getDoctors(offset, limit);
    }
}
exports.GetDoctorsListUseCase = GetDoctorsListUseCase;
