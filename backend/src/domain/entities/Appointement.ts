import { UUID } from "crypto";
export enum status {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    NO_SHOW = "NO_SHOW"
}
export class Appointement {
    public id: UUID
    public patientId: UUID
    public doctorId: UUID
    public roomId: UUID
    public createdByReceptionId: UUID | null
    public createdByDoctorId: UUID | null
    public appointementDate: Date
    public estimatedDurationInMinutes: number
    public status: status

    constructor(id: UUID, patientId: UUID, doctorId: UUID, roomId: UUID, createdByReceptionId: UUID | null, createdByDoctorId: UUID | null, appointementDate: Date, estimatedDurationInMinutes: number, status: status) {
        this.id = id
        this.patientId = patientId
        this.doctorId = doctorId
        this.roomId = roomId
        this.createdByReceptionId = createdByReceptionId
        this.createdByDoctorId = createdByDoctorId
        this.appointementDate = appointementDate
        this.estimatedDurationInMinutes = estimatedDurationInMinutes
        this.status = status
    }
    public createdBY(): "reception" | "doctor" {
        if (this.createdByReceptionId) {
            return "reception"
        } else {
            return "doctor"
        }
    }
    toJson() {
        return {
            id: this.id,
            patientId: this.patientId,
            doctorId: this.doctorId,
            roomId: this.roomId,
            createdByReceptionId: this.createdByReceptionId,
            createdByDoctorId: this.createdByDoctorId,
            appointementDate: this.appointementDate,
            estimatedDurationInMinutes: this.estimatedDurationInMinutes,
            status: this.status
        }
    }
    
}