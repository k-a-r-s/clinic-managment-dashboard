"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMachineSchemaDto = void 0;
const createMachineDto_1 = require("./createMachineDto");
// notes and serial number removed; machineId optional via create schema
exports.updateMachineSchemaDto = createMachineDto_1.createMachineSchemaDto.partial();
