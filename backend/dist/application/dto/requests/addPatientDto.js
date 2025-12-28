"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPatientSchemaDto = void 0;
const zod_1 = require("zod");
exports.addPatientSchemaDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    phoneNumber: zod_1.z.string().min(1, 'Phone number is required'),
    birthDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
    gender: zod_1.z.string().min(1, 'Gender is required'),
    address: zod_1.z.string().min(1, 'Address is required'),
    profession: zod_1.z.string().min(1, 'Profession is required'),
    childrenNumber: zod_1.z.number().int().min(0, 'Children number cannot be negative'),
    familySituation: zod_1.z.string().min(1, 'Family situation is required'),
    insuranceNumber: zod_1.z.string().min(1, 'Insurance number is required'),
    emergencyContactName: zod_1.z.string().min(1, 'Emergency contact name is required'),
    emergencyContactPhone: zod_1.z.string().min(1, 'Emergency contact phone is required'),
});
