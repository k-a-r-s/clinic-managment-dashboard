import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
import { UserForm } from "../components/UserForm";
import { createUser } from "../api/users.api";
import { toast } from "react-hot-toast";
import type { UserFormData } from "../../../types";

interface AddUserProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function AddUser({ onCancel, onSuccess }: AddUserProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      await createUser(data as any);
      toast.success("User created successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Failed to create user:", err);
      toast.error(err?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Add User"
        subtitle="Create a new doctor or receptionist"
      />

      <UserForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Create User"
      />
    </div>
  );
}
