"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialysisSession = void 0;
class DialysisSession {
    constructor(props) {
        this.props = props;
    }
    getId() {
        return this.props.id;
    }
    getDialysisPatientId() {
        return this.props.dialysisPatientId;
    }
    getSessionDate() {
        return this.props.sessionDate;
    }
    getDurationMinutes() {
        return this.props.durationMinutes;
    }
    getCompleted() {
        return this.props.completed;
    }
    getComplications() {
        return this.props.complications;
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
            dialysisPatientId: this.props.dialysisPatientId,
            sessionDate: this.props.sessionDate,
            durationMinutes: this.props.durationMinutes,
            completed: this.props.completed,
            complications: this.props.complications,
            notes: this.props.notes,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
exports.DialysisSession = DialysisSession;
