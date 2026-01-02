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
      firstName: u.firstName ?? u.first_name ?? "",
      lastName: u.lastName ?? u.last_name ?? "",
      role: u.role ?? "receptionist",
      createdAt: u.createdAt ?? u.created_at,
      updatedAt: u.updatedAt ?? u.updated_at,
      phoneNumber: u.phoneNumber ?? u.phone_number ?? "",
      salary: u.salary ?? 0,
      specialization: u.specialization ?? "",
      isMedicalDirector: u.isMedicalDirector ?? u.is_medical_director ?? false,
    };

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
    firstName: u.firstName ?? u.first_name ?? "",
    lastName: u.lastName ?? u.last_name ?? "",
    role: u.role ?? "receptionist",
    createdAt: u.createdAt ?? u.created_at,
    updatedAt: u.updatedAt ?? u.updated_at,
    phoneNumber: u.phoneNumber ?? u.phone_number ?? "",
    salary: u.salary ?? 0,
    specialization: u.specialization ?? "",
    isMedicalDirector: u.isMedicalDirector ?? u.is_medical_director ?? false,
  };

  return user;
};

export const createUser = async (data: UserFormData): Promise<User> => {
  // Backend expects flat structure with all fields at root level
  const payload: any = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    password: data.password,
  };

  // Add role-specific fields if provided
  if (data.phoneNumber) {
    payload.phoneNumber = data.phoneNumber;
  }
  if (data.role === "doctor") {
    if (data.salary !== undefined) payload.salary = data.salary;
    if (data.specialization) payload.specialization = data.specialization;
    if (data.isMedicalDirector !== undefined)
      payload.isMedicalDirector = data.isMedicalDirector;
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
