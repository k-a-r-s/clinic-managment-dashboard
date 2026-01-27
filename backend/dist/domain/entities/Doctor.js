"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const User_1 = require("./User");
class Doctor extends User_1.User {
    constructor(id, email, firstName, lastName, speciality) {
        super(id, email, firstName, lastName, "doctor");
        this.speciality = speciality;
        this.isMedicalSupervisor = false;
        this.specialisation = "general";
        this.salary = 0;
    }
    setIsMedicalSupervisor(isMedicalSupervisor) {
        this.isMedicalSupervisor = isMedicalSupervisor;
    }
    setPhoneNumber(phone) {
        this.phoneNumber = phone;
    }
    getPhoneNumber() {
        return this.phoneNumber;
    }
    IsMedicalSupervisor() {
        return this.isMedicalSupervisor;
    }
    setSpecialisation(specialisation) {
        this.specialisation = specialisation;
    }
    getSpecialisation() {
        return this.specialisation;
    }
    setSpeciality(speciality) {
        this.speciality = speciality;
    }
    getSpeciality() {
        return this.speciality;
    }
    getSalary() {
        return this.salary;
    }
    setSalary(salary) {
        this.salary = salary;
    }
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            speciality: this.speciality,
            isMedicalSupervisor: this.isMedicalSupervisor,
            specialisation: this.specialisation,
            phoneNumber: this.phoneNumber,
            salary: this.salary,
        };
    }
}
exports.Doctor = Doctor;
