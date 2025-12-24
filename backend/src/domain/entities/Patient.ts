import { differenceInYears } from "date-fns";

export interface PatientProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  insuranceNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalFileId: string | null;
}

export class Patient {
  constructor(private props: PatientProps) { }

  public getId(): string {
    return this.props.id;
  }
  public getMedicalFileId(): string | null {
    return this.props.medicalFileId;
  }
  public getFirstName(): string {
    return this.props.firstName;
  }

  public getLastName(): string {
    return this.props.lastName;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getPhoneNumber(): string {
    return this.props.phoneNumber;
  }

  public getBirthDate(): string {
    return this.props.birthDate;
  }

  public getGender(): string {
    return this.props.gender;
  }

  public getAddress(): string {
    return this.props.address;
  }

  public getProfession(): string {
    return this.props.profession;
  }

  public getChildrenNumber(): number {
    return this.props.childrenNumber;
  }

  public getFamilySituation(): string {
    return this.props.familySituation;
  }

  public getInsuranceNumber(): string {
    return this.props.insuranceNumber;
  }

  public getEmergencyContactName(): string {
    return this.props.emergencyContactName;
  }

  public getEmergencyContactPhone(): string {
    return this.props.emergencyContactPhone;
  }

  public getAge(): number {
    return differenceInYears(new Date(), new Date(this.props.birthDate));
  }

  public toJson() {
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
