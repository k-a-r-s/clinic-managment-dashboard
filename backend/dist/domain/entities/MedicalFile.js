"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalFile = void 0;
class MedicalFile {
    constructor(doctorId, data, id) {
        if (id) {
            this.id = id;
        }
        else {
            this.id = crypto.randomUUID();
        }
        this.doctorId = doctorId;
        this.data = data;
    }
    getDoctorId() {
        return this.doctorId;
    }
    getData() {
        return this.data;
    }
}
exports.MedicalFile = MedicalFile;
