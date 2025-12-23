import { useState } from "react";
import RoomsList from "./RoomsList";
import AddRoomModal from "./AddRoomModal";

export default function RoomsLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdded = () => {
    setIsOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rooms</h1>
          <p className="text-sm text-gray-600">Manage clinic rooms and availability</p>
        </div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg"
          >
            Add Room
          </button>
        </div>
      </div>

      <RoomsList refreshKey={refreshKey} />

      <AddRoomModal isOpen={isOpen} onClose={() => setIsOpen(false)} onAdded={handleAdded} />
    </div>
  );
}
