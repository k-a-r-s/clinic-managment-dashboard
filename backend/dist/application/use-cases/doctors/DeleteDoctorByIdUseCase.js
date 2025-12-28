"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDoctorByIdUseCase = void 0;
class DeleteDoctorByIdUseCase {
    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
    async execute(id) {
        const doctor = await this.doctorRepository.getDoctorById(id);
        if (!doctor) {
            throw new Error("Doctor not found");
        }
        await this.doctorRepository.deleteDoctorById(id);
    }
}
exports.DeleteDoctorByIdUseCase = DeleteDoctorByIdUseCase;
