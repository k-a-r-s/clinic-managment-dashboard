"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointement = exports.status = void 0;
var status;
(function (status) {
    status["SCHEDULED"] = "SCHEDULED";
    status["COMPLETED"] = "COMPLETED";
    status["CANCELED"] = "CANCELED";
    status["NO_SHOW"] = "NO_SHOW";
})(status || (exports.status = status = {}));
class Appointement {
    constructor(id, patientId, doctorId, roomId, createdByReceptionId, createdByDoctorId, appointmentDate, estimatedDurationInMinutes, status) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.roomId = roomId;
        this.createdByReceptionId = createdByReceptionId;
        this.createdByDoctorId = createdByDoctorId;
        this.appointmentDate = appointmentDate;
        this.estimatedDurationInMinutes = estimatedDurationInMinutes;
        this.status = status;
    }
    createdBY() {
        if (this.createdByReceptionId) {
            return "reception";
        }
        else {
            return "doctor";
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
            appointmentDate: this.appointmentDate,
            estimatedDurationInMinutes: this.estimatedDurationInMinutes,
            status: this.status
        };
    }
}
exports.Appointement = Appointement;
