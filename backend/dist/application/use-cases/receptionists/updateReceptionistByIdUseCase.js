"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReceptionistByIdUseCase = void 0;
class UpdateReceptionistByIdUseCase {
    constructor(receptionistRepository) {
        this.receptionistRepository = receptionistRepository;
    }
    async execute(id, receptionistData) {
        return await this.receptionistRepository.updateReceptionistById(id, receptionistData);
    }
}
exports.UpdateReceptionistByIdUseCase = UpdateReceptionistByIdUseCase;
