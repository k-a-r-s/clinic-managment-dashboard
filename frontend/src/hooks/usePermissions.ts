import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../lib/permissions";
import type { Resource, Action, Role } from "../lib/permissions";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role as Role | undefined;

  const can = (resource: Resource, action: Action): boolean => {
    if (!role) return false;
    return hasPermission(role, resource, action);
  };

  const cannot = (resource: Resource, action: Action): boolean => {
    return !can(resource, action);
  };

  return {
    can,
    cannot,
    role,
  };
}
