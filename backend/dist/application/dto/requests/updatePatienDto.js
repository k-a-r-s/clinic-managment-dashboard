"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchemaDto = void 0;
const zod_1 = require("zod");
exports.updatePatientSchemaDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required').optional(),
    lastName: zod_1.z.string().min(1, 'Last name is required').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
    phoneNumber: zod_1.z.string().min(1, 'Phone number is required').optional(),
    birthDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format').optional(),
    gender: zod_1.z.string().min(1, 'Gender is required').optional(),
    address: zod_1.z.string().min(1, 'Address is required').optional(),
    profession: zod_1.z.string().min(1, 'Profession is required').optional(),
    childrenNumber: zod_1.z.number().int().min(0, 'Children number cannot be negative').optional(),
    familySituation: zod_1.z.string().min(1, 'Family situation is required').optional(),
    insuranceNumber: zod_1.z.string().min(1, 'Insurance number is required').optional(),
    emergencyContactName: zod_1.z.string().min(1, 'Emergency contact name is required').optional(),
    emergencyContactPhone: zod_1.z.string().min(1, 'Emergency contact phone is required').optional(),
    medicalFileId: zod_1.z.string().uuid().optional()
});
