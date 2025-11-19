export class User {
    private _id: string;
    private _email: string;
    private _firstName: string;
    private _lastName: string;
    private _role: "admin" | "doctor" | "receptionist";
    private _authUUID?: string | null;
    constructor(id: string, email: string, firstName: string, lastName: string, role: "admin" | "doctor" | "receptionist", authUUID?: string | null) {
        this._id = id;
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._role = role;
        this._authUUID = authUUID;
    }
    get id() {
        return this._id
    }
    get email() {
        return this._email
    }
    get 

}