"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProtocol = void 0;
const uuid_1 = require("uuid");
const DialysisProtocol_1 = require("../../../domain/entities/DialysisProtocol");
class CreateProtocol {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(data) {
        const protocol = new DialysisProtocol_1.DialysisProtocol({
            id: (0, uuid_1.v4)(),
            dialysisPatientId: data.dialysisPatientId,
            dialysisType: data.dialysisType,
            sessionsPerWeek: data.sessionsPerWeek,
            sessionDurationMinutes: data.sessionDurationMinutes,
            accessType: data.accessType,
            targetWeightKg: data.targetWeightKg,
            notes: data.notes,
        });
        return await this.dialysisRepository.createProtocol(protocol);
    }
}
exports.CreateProtocol = CreateProtocol;
