export interface MachineProps {
  id: string;
  machineId: string;
  manufacturer?: string | null;
  model?: string | null;
  status: "available" | "in-use" | "maintenance" | "out-of-service";
  lastMaintenanceDate: string; // YYYY-MM-DD
  nextMaintenanceDate: string; // YYYY-MM-DD
  isActive: boolean;
  // store room reference as UUID to normalize (room id)
  roomId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export class Machine {
  constructor(private props: MachineProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getMachineId(): string {
    return this.props.machineId;
  }

  public getManufacturer(): string | undefined | null {
    return this.props.manufacturer;
  }

  public getModel(): string | undefined | null {
    return this.props.model;
  }

  public getStatus(): MachineProps["status"] {
    return this.props.status;
  }

  public getLastMaintenanceDate(): string {
    return this.props.lastMaintenanceDate;
  }

  public getNextMaintenanceDate(): string {
    return this.props.nextMaintenanceDate;
  }

  public getIsActive(): boolean {
    return this.props.isActive;
  }

  public getRoomId(): string | undefined | null {
    return this.props.roomId;
  }

  public toJson() {
    return {
      id: this.props.id,
      machineId: this.props.machineId,
      manufacturer: this.props.manufacturer,
      model: this.props.model,
      status: this.props.status,
      lastMaintenanceDate: this.props.lastMaintenanceDate,
      nextMaintenanceDate: this.props.nextMaintenanceDate,
      isActive: this.props.isActive,
      roomId: this.props.roomId,
      room: (this.props as any).room ?? null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
