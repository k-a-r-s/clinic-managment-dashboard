"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicalFileDtoSchema = void 0;
const zod_1 = require("zod");
exports.updateMedicalFileDtoSchema = zod_1.z.object({
    doctorId: zod_1.z.string().optional(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
