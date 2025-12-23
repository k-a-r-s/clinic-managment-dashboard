import { Room } from "../../../domain/entities/Room";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { UpdateRoomDto } from "../../dto/requests/rooms/updateRoomDto";
import { AppError } from "../../../infrastructure/errors/AppError";

export class UpdateRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: string, roomData: UpdateRoomDto): Promise<Room> {
    const existingRoom = await this.roomRepository.getRoomById(id);
    if (!existingRoom) {
      throw new AppError("Room not found", 404);
    }

    return await this.roomRepository.updateRoom(id, roomData);
  }
}
