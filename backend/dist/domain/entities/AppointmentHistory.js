"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentHistory = void 0;
class AppointmentHistory {
    constructor(id, appointmentId, appointmentData, createdAt, updatedAt) {
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
exports.AppointmentHistory = AppointmentHistory;
