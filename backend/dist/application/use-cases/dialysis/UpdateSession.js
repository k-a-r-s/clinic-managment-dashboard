"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSession = void 0;
class UpdateSession {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(id, data) {
        return this.dialysisRepository.updateSession(id, data);
    }
}
exports.UpdateSession = UpdateSession;
