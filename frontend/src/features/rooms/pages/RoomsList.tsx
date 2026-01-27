import { useState, useEffect } from "react";
import { Plus, Edit, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getRooms } from "../api/rooms.api";
import { toast } from "react-hot-toast";
import type { Room } from "../../../types";

interface RoomsListProps {
  onCreateNew?: () => void;
  onEditRoom?: (roomId: string) => void;
}

export function RoomsList({ onCreateNew, onEditRoom }: RoomsListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const roomNumber = room.roomNumber?.toLowerCase() || "";
    const roomType = room.type?.toLowerCase() || "";
    const roomId = room.id.toString().toLowerCase();

    const matchesSearch =
      roomNumber.includes(searchTerm.toLowerCase()) ||
      roomType.includes(searchTerm.toLowerCase()) ||
      roomId.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleEditRoom = (roomId: string) => {
    if (onEditRoom) {
      onEditRoom(roomId);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-200"
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-800 border-red-200"
      >
        <XCircle className="w-3 h-3 mr-1" />
        Occupied
      </Badge>
    );
  };

  const roomColumns: Column<Room>[] = [
    {
      key: "id",
      header: "ID",
      render: (room) => (
        <span className="font-mono text-xs text-gray-600">#{room.id}</span>
      ),
    },
    {
      key: "roomNumber",
      header: "Room Number",
      render: (room) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">{room.roomNumber}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (room) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {room.type || "Standard"}
        </Badge>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (room) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {room.capacity || "—"}{" "}
            {room.capacity && room.capacity > 1 ? "beds" : "bed"}
          </span>
        </div>
      ),
    },
    {
      key: "isAvailable",
      header: "Status",
      render: (room) => getAvailabilityBadge(room.isAvailable ?? true),
    },

    {
      key: "actions",
      header: "Actions",
      render: (room) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditRoom(room.id)}
            className="h-8"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

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
            <BreadcrumbPage>Rooms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <PageHeader
        title="Rooms Management"
        subtitle="Manage all rooms in the clinic"
      />

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Actions Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder="Search by room number, type, or ID..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCreateNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </Button>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredRooms}
              columns={roomColumns}
              getRowKey={(room) => room.id}
              selectedKey={selectedRoomId}
              onRowClick={(room) => setSelectedRoomId(room.id)}
              emptyMessage="No rooms found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredRooms.length} of {rooms.length} rooms
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
