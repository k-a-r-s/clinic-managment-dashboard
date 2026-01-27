"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialysisPatient = void 0;
class DialysisPatient {
    constructor(props) {
        this.props = props;
    }
    getId() {
        return this.props.id;
    }
    getPatientId() {
        return this.props.patientId;
    }
    getStartDate() {
        return this.props.startDate;
    }
    getStatus() {
        return this.props.status;
    }
    getNotes() {
        return this.props.notes;
    }
    getCreatedAt() {
        return this.props.createdAt;
    }
    getUpdatedAt() {
        return this.props.updatedAt;
    }
    toJson() {
        return {
            id: this.props.id,
            patientId: this.props.patientId,
            startDate: this.props.startDate,
            status: this.props.status,
            notes: this.props.notes,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
            // Extended fields
            patientName: this.props.patientName,
            dialysisType: this.props.dialysisType,
            sessionsPerWeek: this.props.sessionsPerWeek,
            lastSessionDate: this.props.lastSessionDate,
            nextSessionDate: this.props.nextSessionDate,
            totalSessions: this.props.totalSessions,
        };
    }
}
exports.DialysisPatient = DialysisPatient;
