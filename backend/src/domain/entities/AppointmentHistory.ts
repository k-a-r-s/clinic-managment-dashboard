import { UUID } from "crypto";

export class AppointmentHistory {
    public id: UUID;
    public appointmentId: UUID;
    public appointmentData: any;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: UUID,
        appointmentId: UUID,
        appointmentData: any,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.appointmentData = appointmentData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJson() {
        return {
            id: this.id,
            appointmentId: this.appointmentId,
            appointmentData: this.appointmentData,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
