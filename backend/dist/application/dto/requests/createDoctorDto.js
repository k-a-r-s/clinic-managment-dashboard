"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDoctorDtoSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateDoctorDtoSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3).max(255),
    lastName: zod_1.default.string().min(3).max(255),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    role: zod_1.default.enum(["DOCTOR"]),
    salary: zod_1.default.number().positive().optional(),
    isMedicalDirector: zod_1.default.boolean().optional(),
    specialization: zod_1.default.string().min(3).max(255).optional(),
    phoneNumber: zod_1.default.string().optional().nullable(),
});
