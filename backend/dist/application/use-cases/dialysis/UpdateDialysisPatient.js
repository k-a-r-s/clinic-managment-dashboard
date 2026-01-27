"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDialysisPatient = void 0;
class UpdateDialysisPatient {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(id, data) {
        return this.dialysisRepository.updateDialysisPatient(id, data);
    }
}
exports.UpdateDialysisPatient = UpdateDialysisPatient;
