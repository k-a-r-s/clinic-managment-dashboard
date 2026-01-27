"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSession = void 0;
class DeleteSession {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(id) {
        return this.dialysisRepository.deleteSession(id);
    }
}
exports.DeleteSession = DeleteSession;
