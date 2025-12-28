"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(id, roomNumber, capacity, type, isAvailable, createdAt, updatedAt) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.type = type;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getId() {
        return this.id;
    }
    getRoomNumber() {
        return this.roomNumber;
    }
    getCapacity() {
        return this.capacity;
    }
    getType() {
        return this.type;
    }
    getIsAvailable() {
        return this.isAvailable;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
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
exports.Room = Room;
