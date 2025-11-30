import { Doctor } from "../../../domain/entities/Doctor";
import { DoctorRepository } from "../../../infrastructure/repositories/DoctorRepository";

export class UpdateDoctorByIdUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string, doctorData: Partial<Doctor>) {
    return await this.doctorRepository.updateDoctorById(id, doctorData);
  }
}
