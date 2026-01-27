"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReceptionistByIdUseCase = void 0;
class DeleteReceptionistByIdUseCase {
    constructor(receptionistRepository) {
        this.receptionistRepository = receptionistRepository;
    }
    async execute(id) {
        const r = await this.receptionistRepository.getReceptionistById(id);
        if (!r) {
            throw new Error("Receptionist not found");
        }
        await this.receptionistRepository.deleteReceptionistById(id);
    }
}
exports.DeleteReceptionistByIdUseCase = DeleteReceptionistByIdUseCase;
