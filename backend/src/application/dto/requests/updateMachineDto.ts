import { z } from "zod";
import { createMachineSchemaDto } from "./createMachineDto";

// notes and serial number removed; machineId optional via create schema
export const updateMachineSchemaDto = createMachineSchemaDto.partial();

export type UpdateMachineDto = z.infer<typeof updateMachineSchemaDto>;
