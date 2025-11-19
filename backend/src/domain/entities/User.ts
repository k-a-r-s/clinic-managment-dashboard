export class User {
    private id: string;
    private email: string;
    private firstName: string;
    private lastName: string;
    private role: "admin" | "doctor" | "receptionist";

    constructor(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: "admin" | "doctor" | "receptionist"
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    // Getters
    getId(): string { return this.id; }
    getEmail(): string { return this.email; }
    getFirstName(): string { return this.firstName; }
    getLastName(): string { return this.lastName; }
    getRole(): string { return this.role; }

    static fromDataBase(data: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: "admin" | "doctor" | "receptionist";
    }) {
        return new User(data.id, data.email, data.first_name, data.last_name, data.role);
    }
}