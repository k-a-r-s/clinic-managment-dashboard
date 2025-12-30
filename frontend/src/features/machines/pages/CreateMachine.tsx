import { useState, useEffect } from "react";
import { Wrench, Calendar, MapPin, Building, Package } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { PageHeader } from "../../../components/shared/PageHeader";
import {
  createMachine,
  updateMachine,
  getMachineById,
} from "../api/machines.api";
import { getRooms } from "../../rooms/api/rooms.api";
import { toast } from "react-hot-toast";
import type { Room } from "../../../types";

interface CreateMachineProps {
  machineId?: string; // If provided, edit mode
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function CreateMachine({
  machineId,
  onCancel,
  onSuccess,
}: CreateMachineProps) {
  const [formData, setFormData] = useState({
    machineId: "",
    manufacturer: "",
    model: "",
    status: "available" as
      | "available"
      | "in-use"
      | "maintenance"
      | "out-of-service",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
    roomId: "",
    isActive: true,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
    if (machineId) {
      loadMachine();
    }
  }, [machineId]);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    }
  };

  const loadMachine = async () => {
    if (!machineId) return;
    try {
      setIsLoading(true);
      const machine = await getMachineById(machineId);
      setFormData({
        machineId: machine.machineId || "",
        manufacturer: machine.manufacturer || "",
        model: machine.model || "",
        status: machine.status,
        lastMaintenanceDate: machine.lastMaintenanceDate || "",
        nextMaintenanceDate: machine.nextMaintenanceDate || "",
        roomId: machine.room || "",
        isActive: machine.isActive ?? true,
      });
    } catch (error) {
      console.error("Failed to load machine:", error);
      setError("Failed to load machine for editing");
      toast.error("Failed to load machine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.machineId) {
      setError("Machine ID is required");
      return;
    }

    if (!formData.lastMaintenanceDate) {
      setError("Last maintenance date is required");
      return;
    }

    if (!formData.nextMaintenanceDate) {
      setError("Next maintenance date is required");
      return;
    }

    try {
      setIsLoading(true);

      const machineData = {
        machineId: formData.machineId,
        manufacturer: formData.manufacturer || undefined,
        model: formData.model || undefined,
        status: formData.status,
        lastMaintenanceDate: formData.lastMaintenanceDate,
        nextMaintenanceDate: formData.nextMaintenanceDate,
        roomId: formData.roomId || undefined,
        isActive: formData.isActive,
      };

      if (machineId) {
        await updateMachine(machineId, machineData);
        toast.success("Machine updated successfully");
      } else {
        await createMachine(machineData);
        toast.success("Machine created successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save machine:", error);
      setError("Failed to save machine. Please try again.");
      toast.error("Failed to save machine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onCancel}>Machines</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {machineId ? "Edit Machine" : "Add New Machine"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={machineId ? "Edit Machine" : "Add New Machine"}
        subtitle={
          machineId
            ? "Update machine information and maintenance schedule"
            : "Add a new dialysis machine to the system"
        }
      />

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Machine Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Machine ID */}
                <div className="space-y-2">
                  <Label
                    htmlFor="machineId"
                    className="flex items-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    Machine ID *
                  </Label>
                  <Input
                    id="machineId"
                    value={formData.machineId}
                    onChange={(e) => handleChange("machineId", e.target.value)}
                    placeholder="e.g., DM-001"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C8CA8]"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Manufacturer */}
                <div className="space-y-2">
                  <Label
                    htmlFor="manufacturer"
                    className="flex items-center gap-2"
                  >
                    <Building className="w-4 h-4" />
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      handleChange("manufacturer", e.target.value)
                    }
                    placeholder="e.g., Fresenius, Baxter"
                  />
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    placeholder="e.g., 5008S"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Last Maintenance Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lastMaintenanceDate"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Last Maintenance Date *
                  </Label>
                  <Input
                    id="lastMaintenanceDate"
                    type="date"
                    value={formData.lastMaintenanceDate}
                    onChange={(e) =>
                      handleChange("lastMaintenanceDate", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Next Maintenance Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="nextMaintenanceDate"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Next Maintenance Date *
                  </Label>
                  <Input
                    id="nextMaintenanceDate"
                    type="date"
                    value={formData.nextMaintenanceDate}
                    onChange={(e) =>
                      handleChange("nextMaintenanceDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Room */}
              <div className="space-y-2">
                <Label htmlFor="roomId" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Room
                </Label>
                <select
                  id="roomId"
                  value={formData.roomId}
                  onChange={(e) => handleChange("roomId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C8CA8]"
                >
                  <option value="">No room assigned</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} {room.type && `- ${room.type}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-[#1C8CA8] border-gray-300 rounded focus:ring-[#1C8CA8]"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Machine is active
                </Label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? machineId
                      ? "Updating..."
                      : "Creating..."
                    : machineId
                    ? "Update Machine"
                    : "Create Machine"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
