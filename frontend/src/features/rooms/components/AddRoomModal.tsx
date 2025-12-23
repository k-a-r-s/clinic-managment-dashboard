import { useState } from "react";
import { createRoom } from "../api/rooms.api";
import { toast } from "react-hot-toast";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

export default function AddRoomModal({ isOpen, onClose, onAdded }: AddRoomModalProps) {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      roomNumber: String(form.get("roomNumber") ?? ""),
      type: String(form.get("type") ?? "").trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await createRoom(payload);
      toast.success("Room created");
      onAdded && onAdded();
    } catch (err) {
      console.error("Failed to create room", err);
      toast.error("Failed to create room");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Room Number</label>
            <input name="roomNumber" required className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <input name="type" className="w-full px-4 py-2 border rounded" placeholder="consultation, surgery, etc." />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded">
              {isSubmitting ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
