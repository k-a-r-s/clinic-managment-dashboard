"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDtoSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(['doctor', 'receptionist']), // ✅ Added 'admin'
    password: zod_1.z.string().min(2, "Password must be at least 2 characters"), // ✅ REQUIRED, not optional!
});
