"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receptionist = void 0;
const User_1 = require("./User");
class Receptionist extends User_1.User {
    constructor(id, email, firstName, lastName) {
        super(id, email, firstName, lastName, "receptionist");
    }
    setPhoneNumber(phone) {
        this.phoneNumber = phone;
    }
    getPhoneNumber() {
        return this.phoneNumber;
    }
    toJSON() {
        return {
            id: this.getId(),
            email: this.getEmail(),
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            role: this.getRole(),
            phoneNumber: this.phoneNumber,
        };
    }
}
exports.Receptionist = Receptionist;
