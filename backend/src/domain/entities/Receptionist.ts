import { User } from "./User";

export class Receptionist extends User {
  private phoneNumber?: string;

  constructor(id: string, email: string, firstName: string, lastName: string) {
    super(id, email, firstName, lastName, "receptionist");
  }

  setPhoneNumber(phone: string) {
    this.phoneNumber = phone;
  }

  getPhoneNumber(): string | undefined {
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
