"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReceptionistsListUseCase = void 0;
class GetReceptionistsListUseCase {
    constructor(receptionistRepository) {
        this.receptionistRepository = receptionistRepository;
    }
    async execute(page, limit) {
        const offset = (page - 1) * limit;
        return this.receptionistRepository.getReceptionists(offset, limit);
    }
}
exports.GetReceptionistsListUseCase = GetReceptionistsListUseCase;
