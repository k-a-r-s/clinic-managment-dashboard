"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorByIdUseCase = void 0;
class UpdateDoctorByIdUseCase {
    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
    async execute(id, doctorData) {
        return await this.doctorRepository.updateDoctorById(id, doctorData);
    }
}
exports.UpdateDoctorByIdUseCase = UpdateDoctorByIdUseCase;
