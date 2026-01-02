import { useState } from "react";
import { MapPin, Users, Tag, Trash2 } from "lucide-react";
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
  createRoom,
  updateRoom,
  getRoomById,
  deleteRoom,
} from "../api/rooms.api";
import { toast } from "react-hot-toast";
import type { Room } from "../../../types";
import { useEffect } from "react";

interface CreateRoomProps {
  roomId?: string; // If provided, edit mode
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function CreateRoom({ roomId, onCancel, onSuccess }: CreateRoomProps) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "",
    capacity: "",
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  const loadRoom = async () => {
    if (!roomId) return;
    try {
      setIsLoading(true);
      const room = await getRoomById(roomId);
      setFormData({
        roomNumber: room.roomNumber || "",
        type: room.type || "",
        capacity: room.capacity?.toString() || "",
        isAvailable: room.isAvailable ?? true,
      });
    } catch (error) {
      console.error("Failed to load room:", error);
      setError("Failed to load room for editing");
      toast.error("Failed to load room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.roomNumber) {
      setError("Room number is required");
      return;
    }

    try {
      setIsLoading(true);

      const roomData = {
        roomNumber: formData.roomNumber,
        type: formData.type || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        isAvailable: formData.isAvailable,
      };

      if (roomId) {
        await updateRoom(roomId, roomData);
        toast.success("Room updated successfully");
      } else {
        await createRoom(roomData);
        toast.success("Room created successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to save room:", error);
      setError(
        error?.response?.data?.message ||
          "Failed to save room. Please try again."
      );
      toast.error(error?.response?.data?.message || "Failed to save room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDelete = async () => {
    if (!roomId) return;

    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteRoom(roomId);
      toast.success("Room deleted successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    } finally {
      setIsLoading(false);
    }
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
            <BreadcrumbLink onClick={onCancel}>Rooms</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {roomId ? "Edit Room" : "Add New Room"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={roomId ? "Edit Room" : "Add New Room"}
        subtitle={
          roomId
            ? "Update room information and availability"
            : "Add a new room to the clinic"
        }
      />

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Room Number */}
              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Room Number *
                </Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => handleChange("roomNumber", e.target.value)}
                  placeholder="e.g., 101, A-205"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Room Type
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  placeholder="e.g., Dialysis, Consultation, ICU"
                />
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="Number of beds/stations"
                />
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    handleChange("isAvailable", e.target.checked)
                  }
                  className="w-4 h-4 text-[#1C8CA8] border-gray-300 rounded focus:ring-[#1C8CA8]"
                />
                <Label htmlFor="isAvailable" className="cursor-pointer">
                  Room is available
                </Label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t">
                {roomId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Room
                  </Button>
                )}
                <div className="flex items-center gap-3 ml-auto">
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
                      ? roomId
                        ? "Updating..."
                        : "Creating..."
                      : roomId
                      ? "Update Room"
                      : "Create Room"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
