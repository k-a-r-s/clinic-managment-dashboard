"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialysisProtocol = void 0;
class DialysisProtocol {
    constructor(props) {
        this.props = props;
    }
    getId() {
        return this.props.id;
    }
    getDialysisPatientId() {
        return this.props.dialysisPatientId;
    }
    getDialysisType() {
        return this.props.dialysisType;
    }
    getSessionsPerWeek() {
        return this.props.sessionsPerWeek;
    }
    getSessionDurationMinutes() {
        return this.props.sessionDurationMinutes;
    }
    getAccessType() {
        return this.props.accessType;
    }
    getTargetWeightKg() {
        return this.props.targetWeightKg;
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
            dialysisType: this.props.dialysisType,
            sessionsPerWeek: this.props.sessionsPerWeek,
            sessionDurationMinutes: this.props.sessionDurationMinutes,
            accessType: this.props.accessType,
            targetWeightKg: this.props.targetWeightKg,
            notes: this.props.notes,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
exports.DialysisProtocol = DialysisProtocol;
