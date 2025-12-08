export interface MachineProps {
  id: string;
  machineId: string;
  serialNumber: string;
  room: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  createdAt?: string;
}

export class Machine {
  constructor(private props: MachineProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getMachineId(): string {
    return this.props.machineId;
  }

  public getSerialNumber(): string {
    return this.props.serialNumber;
  }

  public getRoom(): string {
    return this.props.room;
  }

  public getStatus(): string {
    return this.props.status;
  }

  public getLastMaintenanceDate(): string {
    return this.props.lastMaintenanceDate;
  }

  public getNextMaintenanceDate(): string {
    return this.props.nextMaintenanceDate;
  }

  public getCreatedAt(): string | undefined {
    return this.props.createdAt;
  }

  public toJson() {
    return {
      id: this.props.id,
      machineId: this.props.machineId,
      serialNumber: this.props.serialNumber,
      room: this.props.room,
      status: this.props.status,
      lastMaintenanceDate: this.props.lastMaintenanceDate,
      nextMaintenanceDate: this.props.nextMaintenanceDate,
      createdAt: this.props.createdAt
    };
  }
}