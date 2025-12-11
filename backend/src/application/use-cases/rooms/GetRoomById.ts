import { Room } from "../../../domain/entities/Room";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { AppError } from "../../../infrastructure/errors/AppError";

export class GetRoomById {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: string): Promise<Room> {
    const room = await this.roomRepository.getRoomById(id);
    if (!room) {
      throw new AppError("Room not found", 404);
    }
    return room;
  }
}
