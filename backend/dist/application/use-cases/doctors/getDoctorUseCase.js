"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoctorUseCase = void 0;
class GetDoctorUseCase {
    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
    async execute(id) {
        return this.doctorRepository.getDoctorById(id);
    }
}
exports.GetDoctorUseCase = GetDoctorUseCase;
