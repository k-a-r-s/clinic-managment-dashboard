"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSessionById = void 0;
class GetSessionById {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(id) {
        return this.dialysisRepository.getSessionById(id);
    }
}
exports.GetSessionById = GetSessionById;
