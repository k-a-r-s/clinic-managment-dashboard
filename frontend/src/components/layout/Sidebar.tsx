import {
  Home,
  Droplets,
  Users,
  Calendar,
  Settings,
  FileBarChart,
  Pill,
  Monitor,
  MapPin,
  UserPlus,
  LogOut,
  UserCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { usePermissions } from "../../hooks/usePermissions";

interface SidebarProps {
  currentPage:
    | "dashboard"
    | "prescription"
    | "machines-management"
    | "dialysis-management"
    | "settings"
    | "add-user"
    | "patients-list"
    | "register-patient"
    | "patient-details"
    | "users-list"
    | "add-user-page"
    | "user-details"
    | "appointments-list"
    | "create-appointment"
    | "appointment-details"
    | "calendar-view"
    | "doctor-availability"
    | "rooms";
  onNavigate: (
    page:
      | "dashboard"
      | "prescription"
      | "machines-management"
      | "dialysis-management"
      | "settings"
      | "add-user"
      | "patients-list"
      | "register-patient"
      | "patient-details"
      | "users-list"
      | "add-user-page"
      | "user-details"
      | "appointments-list"
      | "create-appointment"
      | "appointment-details"
      | "calendar-view"
      | "doctor-availability"
      | "rooms"
  ) => void;
  collapsed?: boolean;
  onLogout?: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed = false,
  onLogout,
}: SidebarProps) {
  const { can } = usePermissions();

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      page: "dashboard" as const,
      show: can("dashboard", "view"),
    },
    {
      icon: Droplets,
      label: "Dialysis Management",
      page: "dialysis-management" as const,
      show: can("dialysis", "view"),
    },
    {
      icon: Monitor,
      label: "Machines",
      page: "machines-management" as const,
      show: can("machines", "view"),
    },
    {
      icon: MapPin,
      label: "Rooms",
      page: "rooms" as const,
      show: can("rooms", "view"),
    },
    {
      icon: Pill,
      label: "Prescriptions",
      page: "prescription" as const,
      show: can("prescriptions", "view"),
    },
    {
      icon: Users,
      label: "Patients",
      page: "patients-list" as const,
      show: can("patients", "view"),
    },
    {
      icon: UserCheck,
      label: "Users",
      page: "users-list" as const,
      show: can("users", "view"),
    },
    {
      icon: Calendar,
      label: "Appointments",
      page: "appointments-list" as const,
      show: can("appointments", "viewAll") || can("appointments", "viewOwn"),
    },
  ];

  const adminMenuItems = [
    {
      icon: Settings,
      label: "Settings",
      page: "settings" as const,
      show: true,
    },
  ];

  return (
    <div
      className="min-h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "80px" : "256px" }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1C8CA8] flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-gray-900">SmartClinic</h1>
              <p className="text-sm text-gray-500">Web Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems
            .filter((item) => item.show)
            .map((item) => {
              const isActive = item.page === currentPage;
              return (
                <li key={item.label}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full ${
                      collapsed ? "justify-center px-2" : "justify-start"
                    } gap-3 ${
                      isActive
                        ? "bg-[#1C8CA8] text-white hover:bg-[#157A93]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => item.page && onNavigate(item.page)}
                    disabled={!item.page}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              );
            })}
        </ul>

        {/* Admin Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {!collapsed && (
            <p className="text-xs text-gray-500 px-3 mb-2">ADMIN</p>
          )}
          <ul className="space-y-2">
            {adminMenuItems
              .filter((item) => item.show)
              .map((item) => {
                const isActive = item.page === currentPage;
                return (
                  <li key={item.label}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full ${
                        collapsed ? "justify-center px-2" : "justify-start"
                      } gap-3 ${
                        isActive
                          ? "bg-[#1C8CA8] text-white hover:bg-[#157A93]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => onNavigate(item.page)}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </li>
                );
              })}
          </ul>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          className={`w-full ${
            collapsed ? "justify-center px-2" : "justify-start"
          } gap-3 text-red-600 hover:bg-red-50 hover:text-red-700`}
          title={collapsed ? "Logout" : undefined}
          onClick={() => onLogout && onLogout()}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
