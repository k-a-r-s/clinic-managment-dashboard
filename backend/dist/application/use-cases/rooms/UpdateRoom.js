"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoom = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class UpdateRoom {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(id, roomData) {
        const existingRoom = await this.roomRepository.getRoomById(id);
        if (!existingRoom) {
            throw new AppError_1.AppError("Room not found", 404);
        }
        return await this.roomRepository.updateRoom(id, roomData);
    }
}
exports.UpdateRoom = UpdateRoom;
