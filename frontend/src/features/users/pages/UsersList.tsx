import { useState, useEffect } from "react";
import { Plus, Eye, Edit, UserCheck, Mail, Phone } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getUsers } from "../api/users.api";
import { toast } from "react-hot-toast";
import type { User } from "../../../types";

interface UsersListProps {
  onViewUser?: (userId: string) => void;
  onEditUser?: (userId: string) => void;
  onAddNew?: () => void;
}

export function UsersList({
  onViewUser,
  onEditUser,
  onAddNew,
}: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    "all" | "doctor" | "receptionist"
  >("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      console.log("Loaded users:", data);
      if (data.length > 0) {
        console.log("First user sample:", data[0]);
      }
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    try {
      const fullName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.id?.toString() || "").includes(searchTerm) ||
        (user.phoneNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "all" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    } catch (error) {
      console.error("Error filtering user:", user, error);
      return false;
    }
  });

  const handleViewUser = (userId: string) => {
    if (onViewUser) {
      onViewUser(userId);
    }
  };

  const handleEditUser = (userId: string) => {
    if (onEditUser) {
      onEditUser(userId);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    }
  };

  const userColumns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="font-mono text-xs text-gray-600">#{user.id}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1C8CA8] rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    ...(selectedRole === "all"
      ? [
          {
            key: "role" as keyof User,
            header: "Role",
            render: (user: User) => (
              <Badge variant={user.role === "doctor" ? "default" : "secondary"}>
                {user.role === "doctor" ? "Doctor" : "Receptionist"}
              </Badge>
            ),
          },
        ]
      : []),
    {
      key: "phone",
      header: "Phone",
      render: (user) => {
        const phoneNumber = user.phoneNumber;
        return phoneNumber ? (
          <div className="flex items-center gap-1 text-gray-700">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-sm">{phoneNumber}</span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    ...(selectedRole === "doctor"
      ? [
          {
            key: "specialization" as keyof User,
            header: "Specialization",
            render: (user: User) =>
              user.role === "doctor" && user.specialization ? (
                <span className="text-sm text-gray-700">
                  {user.specialization}
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              ),
          },
        ]
      : []),
    {
      key: "actions",
      header: "Actions",
      className: "text-left",
      render: (user) => (
        <div className="flex items-center justify-start gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewUser(user.id);
            }}
            className="gap-1 text-[#1C8CA8] hover:bg-teal-50 hover:text-[#157A93]"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user.id);
            }}
            className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <PageHeader title="Users Management" />

      {/* Main White Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search and Role Filter Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <SearchBar
              placeholder="Search by name, user ID, email, or phone..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filter by Role:
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedRole === "all" ? "default" : "outline"}
                onClick={() => setSelectedRole("all")}
                className={selectedRole === "all" ? "bg-[#1C8CA8]" : ""}
              >
                All ({users.length})
              </Button>
              <Button
                size="sm"
                variant={selectedRole === "doctor" ? "default" : "outline"}
                onClick={() => setSelectedRole("doctor")}
                className={selectedRole === "doctor" ? "bg-[#1C8CA8]" : ""}
              >
                Doctors ({users.filter((u) => u.role === "doctor").length})
              </Button>
              <Button
                size="sm"
                variant={
                  selectedRole === "receptionist" ? "default" : "outline"
                }
                onClick={() => setSelectedRole("receptionist")}
                className={
                  selectedRole === "receptionist" ? "bg-[#1C8CA8]" : ""
                }
              >
                Receptionists (
                {users.filter((u) => u.role === "receptionist").length})
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              getRowKey={(user) => user.id}
              selectedKey={selectedUserId}
              onRowClick={(user) => setSelectedUserId(user.id)}
              emptyMessage="No users found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">
              Previous
            </Button>
            <Button size="sm" className="bg-[#1C8CA8] hover:bg-[#157A93]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
