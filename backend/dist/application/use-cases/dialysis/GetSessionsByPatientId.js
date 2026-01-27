"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSessionsByPatientId = void 0;
class GetSessionsByPatientId {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(dialysisPatientId) {
        return await this.dialysisRepository.getSessionsByPatientId(dialysisPatientId);
    }
}
exports.GetSessionsByPatientId = GetSessionsByPatientId;
