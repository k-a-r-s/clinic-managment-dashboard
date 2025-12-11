import { AddPatientDto } from "../../application/dto/requests/addPatientDto";
import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  addPatient(patient: Patient): Promise<null>;
  getPatientByid(id: string): Promise<Patient>;
  deletePatientByid(id: string): Promise<void>;
  getAllPatients(): Promise<Patient[]>;
  updatePatient(patient: Patient): Promise<null>;
}
