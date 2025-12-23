export interface GetMachineResponseDto {
  id: string;
  machineId: string;
  manufacturer?: string | null;
  model?: string | null;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  isActive: boolean;
  room?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type GetMachineByIdResponseDto = GetMachineResponseDto;
