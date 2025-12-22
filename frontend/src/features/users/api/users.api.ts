import axios from "../../../lib/axios";

export async function createUser(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "doctor" | "receptionist";
}) {
  const { data } = await axios.post("/users/add-user", payload);
  return data;
}
