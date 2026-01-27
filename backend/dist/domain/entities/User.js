"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, firstName, lastName, role // ✅ Accept string
    ) {
        // Validate role at construction time
        const validRoles = ["admin", "doctor", "receptionist"];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(", ")}`);
        }
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
    // Getters
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getRole() {
        return this.role;
    }
    static fromDataBase(data) {
        return new User(data.id, data.email, data.first_name, data.last_name, data.role // Validation happens in constructor
        );
    }
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
        };
    }
}
exports.User = User;
