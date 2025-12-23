import { UUID } from "crypto";

export interface MedicalData {
    [key: string]: any
}
export class MedicalFile {
    public id: UUID;
    public doctorId: UUID;
    public data: MedicalData;

    public constructor(doctorId: UUID, data: MedicalData, id?: UUID) {
        if (id) {
            this.id = id;
        } else {
            this.id = crypto.randomUUID() as UUID;
        }   
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