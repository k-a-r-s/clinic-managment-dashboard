"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctorDtoSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateDoctorDtoSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3).max(255).optional().nullable(),
    lastName: zod_1.default.string().min(3).max(255).optional().nullable(),
    email: zod_1.default.string().email().optional().nullable(),
    phoneNumber: zod_1.default.string().optional().nullable(),
    role: zod_1.default.enum(["DOCTOR"]).optional().nullable(),
    salary: zod_1.default.coerce.number().positive().optional().nullable(),
    isMedicalDirector: zod_1.default.boolean().optional().nullable(),
    specialization: zod_1.default.string().min(1).max(255).optional().nullable(),
    is_medical_director: zod_1.default.boolean().optional().nullable(),
    // Allow snake_case from database
}).passthrough();
