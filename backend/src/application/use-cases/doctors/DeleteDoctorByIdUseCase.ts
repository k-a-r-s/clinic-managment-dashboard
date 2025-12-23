import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export class DeleteDoctorByIdUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}
  async execute(id: string) {
    const doctor = await this.doctorRepository.getDoctorById(id);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    await this.doctorRepository.deleteDoctorById(id);
  
  }
}
