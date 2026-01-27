"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProtocolDto = void 0;
const createProtocolDto_1 = require("./createProtocolDto");
exports.updateProtocolDto = createProtocolDto_1.createProtocolDto
    .omit({ dialysisPatientId: true })
    .partial();
