import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { AppError } from "../../../infrastructure/errors/AppError";

export class UpdateRoomAvailability {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: string, isAvailable: boolean): Promise<void> {
    const existingRoom = await this.roomRepository.getRoomById(id);
    if (!existingRoom) {
      throw new AppError("Room not found", 404);
    }

    await this.roomRepository.updateRoomAvailability(id, isAvailable);
  }
}
