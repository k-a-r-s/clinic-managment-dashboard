"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchemaDto = void 0;
const zod_1 = require("zod");
exports.updateUserSchemaDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required").optional(),
    lastName: zod_1.z.string().min(1, "Last name is required").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    phoneNumber: zod_1.z.string().optional(),
    // Doctor-specific fields
    salary: zod_1.z.number().positive("Salary must be positive").optional(),
    specialization: zod_1.z.string().optional(),
    isMedicalDirector: zod_1.z.boolean().optional(),
});
