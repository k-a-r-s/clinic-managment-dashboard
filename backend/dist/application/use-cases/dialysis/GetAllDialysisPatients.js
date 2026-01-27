"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllDialysisPatients = void 0;
class GetAllDialysisPatients {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(filters) {
        return await this.dialysisRepository.getAllDialysisPatients(filters);
    }
}
exports.GetAllDialysisPatients = GetAllDialysisPatients;
