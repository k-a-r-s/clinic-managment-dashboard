import { Doctor } from "../entities/Doctor";
import { GetDoctorsList } from "../../application/dto/responses/getDoctorsList";

export interface IDoctorRepository {
  getDoctorById(id: string): Promise<Doctor | null>;
  getDoctors(offset: number, limit: number): Promise<GetDoctorsList>;
  updateDoctorById(id: string, doctorData: Partial<Doctor>): Promise<Doctor>;
  deleteDoctorById(id: string): Promise<void>;
}
