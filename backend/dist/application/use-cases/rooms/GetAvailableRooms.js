"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableRooms = void 0;
class GetAvailableRooms {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute() {
        return await this.roomRepository.getAvailableRooms();
    }
}
exports.GetAvailableRooms = GetAvailableRooms;
