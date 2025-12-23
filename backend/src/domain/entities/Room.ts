export class Room {
  constructor(
    private id: string,
    private roomNumber: string,
    private capacity: number,
    private type: string,
    private isAvailable: boolean,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  getId(): string {
    return this.id;
  }

  getRoomNumber(): string {
    return this.roomNumber;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getType(): string {
    return this.type;
  }

  getIsAvailable(): boolean {
    return this.isAvailable;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      roomNumber: this.roomNumber,
      capacity: this.capacity,
      type: this.type,
      isAvailable: this.isAvailable,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
