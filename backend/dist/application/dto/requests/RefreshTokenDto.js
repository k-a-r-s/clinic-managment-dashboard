"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDtoSchema = void 0;
const zod_1 = require("zod");
exports.RefreshTokenDtoSchema = zod_1.z.object({
    refresh_token: zod_1.z.string().nonempty(),
});
