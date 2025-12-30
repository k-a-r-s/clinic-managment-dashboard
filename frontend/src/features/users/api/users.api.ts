import axiosInstance from "../../../lib/axios";
import type { User, UserFormData, CreateUserPayload } from "../../../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/users");
  const body = response.data as any;
  console.log("Raw users data from API:", body);

  // Response may be paginated: { total, users } or direct array
  const raw = Array.isArray(body) ? body : body?.users ?? [];

  // Map server shape to frontend shape
  const mapped: User[] = (raw || []).map((u: any) => {
    const baseUser: User = {
      id: u.id ?? u._id ?? u.uuid ?? "",
      email: u.email ?? "",
      firstName: u.first_name ?? u.firstName ?? "",
      lastName: u.last_name ?? u.lastName ?? "",
      role: u.role ?? "receptionist",
      createdAt: u.created_at ?? u.createdAt,
      updatedAt: u.updated_at ?? u.updatedAt,
    };

    // Add role-specific details
    if (u.role === "doctor" && u.doctor_details) {
      baseUser.doctorDetails = {
        phoneNumber:
          u.doctor_details.phone_number ?? u.doctor_details.phoneNumber ?? "",
        salary:
          typeof u.doctor_details.salary === "number"
            ? u.doctor_details.salary
            : Number(u.doctor_details.salary) || 0,
        isMedicalDirector:
          u.doctor_details.is_medical_director ??
          u.doctor_details.isMedicalDirector ??
          false,
        specialization: u.doctor_details.specialization ?? "",
      };
    } else if (u.role === "receptionist" && u.receptionist_details) {
      baseUser.receptionistDetails = {
        phoneNumber:
          u.receptionist_details.phone_number ??
          u.receptionist_details.phoneNumber ??
          "",
      };
    }

    return baseUser;
  });

  return mapped;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  const u = response.data;

  const user: User = {
    id: u.id ?? "",
    email: u.email ?? "",
    firstName: u.first_name ?? u.firstName ?? "",
    lastName: u.last_name ?? u.lastName ?? "",
    role: u.role ?? "receptionist",
    createdAt: u.created_at ?? u.createdAt,
    updatedAt: u.updated_at ?? u.updatedAt,
  };

  if (u.role === "doctor" && u.doctor_details) {
    user.doctorDetails = {
      phoneNumber:
        u.doctor_details.phone_number ?? u.doctor_details.phoneNumber ?? "",
      salary:
        typeof u.doctor_details.salary === "number"
          ? u.doctor_details.salary
          : Number(u.doctor_details.salary) || 0,
      isMedicalDirector:
        u.doctor_details.is_medical_director ??
        u.doctor_details.isMedicalDirector ??
        false,
      specialization: u.doctor_details.specialization ?? "",
    };
  } else if (u.role === "receptionist" && u.receptionist_details) {
    user.receptionistDetails = {
      phoneNumber:
        u.receptionist_details.phone_number ??
        u.receptionist_details.phoneNumber ??
        "",
    };
  }

  return user;
};

export const createUser = async (data: UserFormData): Promise<User> => {
  const payload: CreateUserPayload = {
    profile: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      password: data.password,
    },
  };

  if (data.role === "doctor") {
    payload.doctorDetails = {
      phoneNumber: data.phoneNumber || "",
      salary: data.salary || 0,
      isMedicalDirector: data.isMedicalDirector || false,
      specialization: data.specialization || "",
    };
  } else if (data.role === "receptionist") {
    payload.receptionistDetails = {
      phoneNumber: data.phoneNumber || "",
    };
  }

  const response = await axiosInstance.post("/users/add-user", payload);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<UserFormData>
): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
