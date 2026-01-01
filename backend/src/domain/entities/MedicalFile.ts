import { UUID } from "crypto";

export interface MedicalData {
    [key: string]: any
}
export class MedicalFile {
    public id: UUID;
    // doctorId may be null when the medical file is created without an associated doctor
    public doctorId: UUID | null;
    public data: MedicalData;

    public constructor(doctorId: UUID | null, data: MedicalData, id?: UUID) {
        if (id) {
            this.id = id;
        } else {
            this.id = crypto.randomUUID() as UUID;
        }
        this.doctorId = doctorId;
        this.data = data;
    }

    public getDoctorId(): UUID | null {
        return this.doctorId;
    }

    public getData(): MedicalData {
        return this.data;
    }
}