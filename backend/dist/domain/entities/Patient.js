"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const date_fns_1 = require("date-fns");
class Patient {
    constructor(props) {
        this.props = props;
    }
    getId() {
        return this.props.id;
    }
    getMedicalFileId() {
        return this.props.medicalFileId;
    }
    getFirstName() {
        return this.props.firstName;
    }
    getLastName() {
        return this.props.lastName;
    }
    getEmail() {
        return this.props.email;
    }
    getPhoneNumber() {
        return this.props.phoneNumber;
    }
    getBirthDate() {
        return this.props.birthDate;
    }
    getGender() {
        return this.props.gender;
    }
    getAddress() {
        return this.props.address;
    }
    getProfession() {
        return this.props.profession;
    }
    getChildrenNumber() {
        return this.props.childrenNumber;
    }
    getFamilySituation() {
        return this.props.familySituation;
    }
    getInsuranceNumber() {
        return this.props.insuranceNumber;
    }
    getEmergencyContactName() {
        return this.props.emergencyContactName;
    }
    getEmergencyContactPhone() {
        return this.props.emergencyContactPhone;
    }
    getAge() {
        return (0, date_fns_1.differenceInYears)(new Date(), new Date(this.props.birthDate));
    }
    toJson() {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email,
            phoneNumber: this.props.phoneNumber,
            birthDate: this.props.birthDate,
            age: this.getAge(),
            gender: this.props.gender,
            address: this.props.address,
            profession: this.props.profession,
            childrenNumber: this.props.childrenNumber,
            familySituation: this.props.familySituation,
            insuranceNumber: this.props.insuranceNumber,
            emergencyContactName: this.props.emergencyContactName,
            emergencyContactPhone: this.props.emergencyContactPhone,
            MedicalFileId: this.props.medicalFileId,
        };
    }
}
exports.Patient = Patient;
