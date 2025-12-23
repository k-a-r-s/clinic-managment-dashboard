import { useEffect, useState } from "react";
import { getRooms } from "../api/rooms.api";
import type { Room } from "../../../types";
import { toast } from "react-hot-toast";

export default function RoomsList({ refreshKey }: { refreshKey?: number }) {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    load();
  }, [])

  useEffect(() => {
    if (typeof refreshKey !== 'undefined') load();
  }, [refreshKey])

  const load = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to load rooms", err);
      toast.error("Failed to load rooms");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="py-2">Room Number</th>
            <th className="py-2">Type</th>
            <th className="py-2">Available</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-3 font-medium">{r.roomNumber}</td>
              <td className="py-3">{r.type ?? "—"}</td>
              <td className="py-3">{r.isAvailable ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
