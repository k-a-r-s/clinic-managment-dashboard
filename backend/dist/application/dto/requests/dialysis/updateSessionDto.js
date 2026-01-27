"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionDto = void 0;
const createSessionDto_1 = require("./createSessionDto");
exports.updateSessionDto = createSessionDto_1.createSessionDto
    .omit({ dialysisPatientId: true })
    .partial();
