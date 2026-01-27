"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProtocolByPatientId = void 0;
class GetProtocolByPatientId {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(dialysisPatientId) {
        return await this.dialysisRepository.getProtocolByPatientId(dialysisPatientId);
    }
}
exports.GetProtocolByPatientId = GetProtocolByPatientId;
