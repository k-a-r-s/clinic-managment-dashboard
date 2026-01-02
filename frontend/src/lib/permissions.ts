export type Role = "admin" | "doctor" | "receptionist";

export type Resource =
  | "dashboard"
  | "patients"
  | "appointments"
  | "medicalFiles"
  | "prescriptions"
  | "dialysis"
  | "machines"
  | "rooms"
  | "users";

export type Action =
  | "view"
  | "viewAll"
  | "viewOwn"
  | "create"
  | "edit"
  | "delete"
  | "enroll"
  | "viewProtocol"
  | "editProtocol"
  | "manageSessions"
  | "updateStatus"
  | "cancel";

type PermissionMatrix = {
  [key in Role]: {
    [key in Resource]?: Action[];
  };
};

const permissions: PermissionMatrix = {
  admin: {
    dashboard: ["view"],
    patients: ["view", "create", "edit", "delete"],
    appointments: ["viewAll", "create", "edit", "cancel", "delete"],
    medicalFiles: ["view", "edit"],
    prescriptions: ["view", "create", "edit", "delete"],
    dialysis: [
      "view",
      "enroll",
      "viewProtocol",
      "editProtocol",
      "manageSessions",
      "delete",
    ],
    machines: ["view", "create", "edit", "updateStatus", "delete"],
    rooms: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
  },
  doctor: {
    dashboard: ["view"],
    patients: ["view"],
    appointments: ["viewOwn", "create"],
    medicalFiles: ["view", "edit"],
    prescriptions: ["view", "create", "edit"],
    dialysis: ["view", "viewProtocol", "editProtocol", "manageSessions"],
    machines: ["view"],
    rooms: ["view"],
  },
  receptionist: {
    dashboard: ["view"],
    patients: ["view", "create", "edit"],
    appointments: ["viewAll", "create", "edit", "cancel"],
    prescriptions: ["view"],
    dialysis: ["view", "viewProtocol"],
    machines: ["view", "updateStatus"],
    rooms: ["view"],
  },
};

export function hasPermission(
  role: Role,
  resource: Resource,
  action: Action
): boolean {
  const rolePermissions = permissions[role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}
