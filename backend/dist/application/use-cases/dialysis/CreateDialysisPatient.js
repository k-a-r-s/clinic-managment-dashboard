"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDialysisPatient = void 0;
const uuid_1 = require("uuid");
const DialysisPatient_1 = require("../../../domain/entities/DialysisPatient");
class CreateDialysisPatient {
    constructor(dialysisRepository) {
        this.dialysisRepository = dialysisRepository;
    }
    async execute(data) {
        const dialysisPatient = new DialysisPatient_1.DialysisPatient({
            id: (0, uuid_1.v4)(),
            patientId: data.patientId,
            startDate: new Date(data.startDate),
            status: data.status || "active",
            notes: data.notes,
        });
        return await this.dialysisRepository.createDialysisPatient(dialysisPatient);
    }
}
exports.CreateDialysisPatient = CreateDialysisPatient;
