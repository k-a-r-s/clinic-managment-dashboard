"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalFileDtoSchema = void 0;
const zod_1 = require("zod");
exports.createMedicalFileDtoSchema = zod_1.z.object({
    patientId: zod_1.z.uuidv4(),
    doctorId: zod_1.z.uuidv4(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).nullable(),
});
