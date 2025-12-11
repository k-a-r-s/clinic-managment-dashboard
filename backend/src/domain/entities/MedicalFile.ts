import { UUID } from "crypto";

export interface MedicalData {
    [key: string]: any
}
export class MedicalFile {
    public id: UUID;
    public doctorId: UUID;
    public data: MedicalData;

    public constructor(doctorId: UUID, data: MedicalData) {
        this.doctorId = doctorId;
        this.data = data;
    }

    public getDoctorId(): UUID {
        return this.doctorId;
    }

    public getData(): MedicalData {
        return this.data;
    }
}