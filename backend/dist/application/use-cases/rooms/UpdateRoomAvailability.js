"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomAvailability = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class UpdateRoomAvailability {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(id, isAvailable) {
        const existingRoom = await this.roomRepository.getRoomById(id);
        if (!existingRoom) {
            throw new AppError_1.AppError("Room not found", 404);
        }
        await this.roomRepository.updateRoomAvailability(id, isAvailable);
    }
}
exports.UpdateRoomAvailability = UpdateRoomAvailability;
