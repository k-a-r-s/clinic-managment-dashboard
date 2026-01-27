"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProtocol = void 0;
class UpdateProtocol {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(id, data) {
        return this.dialysisRepository.updateProtocol(id, data);
    }
}
exports.UpdateProtocol = UpdateProtocol;
