"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReceptionistUseCase = void 0;
class GetReceptionistUseCase {
    constructor(receptionistRepository) {
        this.receptionistRepository = receptionistRepository;
    }
    async execute(id) {
        return this.receptionistRepository.getReceptionistById(id);
    }
}
exports.GetReceptionistUseCase = GetReceptionistUseCase;
