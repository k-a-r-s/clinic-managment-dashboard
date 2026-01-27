"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoom = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class DeleteRoom {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(id) {
        const existingRoom = await this.roomRepository.getRoomById(id);
        if (!existingRoom) {
            throw new AppError_1.AppError("Room not found", 404);
        }
        await this.roomRepository.deleteRoom(id);
    }
}
exports.DeleteRoom = DeleteRoom;
