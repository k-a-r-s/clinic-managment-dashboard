"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machine = void 0;
class Machine {
    constructor(props) {
        this.props = props;
    }
    getId() {
        return this.props.id;
    }
    getMachineId() {
        return this.props.machineId;
    }
    getManufacturer() {
        return this.props.manufacturer;
    }
    getModel() {
        return this.props.model;
    }
    getStatus() {
        return this.props.status;
    }
    getLastMaintenanceDate() {
        return this.props.lastMaintenanceDate;
    }
    getNextMaintenanceDate() {
        return this.props.nextMaintenanceDate;
    }
    getIsActive() {
        return this.props.isActive;
    }
    getRoomId() {
        return this.props.roomId;
    }
    toJson() {
        return {
            id: this.props.id,
            machineId: this.props.machineId,
            manufacturer: this.props.manufacturer,
            model: this.props.model,
            status: this.props.status,
            lastMaintenanceDate: this.props.lastMaintenanceDate,
            nextMaintenanceDate: this.props.nextMaintenanceDate,
            isActive: this.props.isActive,
            roomId: this.props.roomId,
            room: this.props.room ?? null,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
exports.Machine = Machine;
