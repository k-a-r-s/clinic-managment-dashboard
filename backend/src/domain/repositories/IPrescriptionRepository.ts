import { CreatePrescriptionDto } from "../../application/dto/requests/createPrescriptionDto";
import { UpdatePrescriptionDto } from "../../application/dto/requests/updatePrescriptionDto";
import { GetPrescriptionResponseDto } from "../../application/dto/responses/prescriptions/getPrescription";

export interface IPrescriptionRepository {
  createPrescription(
    data: CreatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto>;
  getPrescriptions(): Promise<GetPrescriptionResponseDto[]>;
  getPrescriptionById(id: string): Promise<GetPrescriptionResponseDto>;
  getPrescriptionsByPatientId(
    patientId: string
  ): Promise<GetPrescriptionResponseDto[]>;
  updatePrescription(
    id: string,
    data: UpdatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto>;
  deletePrescription(id: string): Promise<void>;
}
