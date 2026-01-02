import type { ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";
import type { Resource, Action } from "../../lib/permissions";

interface ProtectedProps {
  resource: Resource;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Protected({
  resource,
  action,
  children,
  fallback = null,
}: ProtectedProps) {
  const { can } = usePermissions();

  if (!can(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
