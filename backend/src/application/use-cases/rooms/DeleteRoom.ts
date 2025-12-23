import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { AppError } from "../../../infrastructure/errors/AppError";

export class DeleteRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: string): Promise<void> {
    const existingRoom = await this.roomRepository.getRoomById(id);
    if (!existingRoom) {
      throw new AppError("Room not found", 404);
    }

    await this.roomRepository.deleteRoom(id);
  }
}
