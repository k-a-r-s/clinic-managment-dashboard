import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Checkbox } from "../../../components/ui/checkbox";
import type {
  DialysisSession,
  SessionFormData,
} from "../../../types/dialysis.types";
import { updateDialysisSession } from "../api/dialysis.api";
import { toast } from "react-hot-toast";

interface EditSessionModalProps {
  session: DialysisSession;
  onClose: () => void;
}

export function EditSessionModal({ session, onClose }: EditSessionModalProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    sessionDate: session.sessionDate.split("T")[0],
    durationMinutes: session.durationMinutes,
    completed: session.completed,
    complications: session.complications || "",
    notes: session.notes || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sessionDate) {
      toast.error("Please fill in session date");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDialysisSession(session.id, formData);
      toast.success("Session updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update session:", error);
      toast.error("Failed to update session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDurationChange = (hours: number, minutes: number) => {
    setFormData({
      ...formData,
      durationMinutes: hours * 60 + minutes,
    });
  };

  const hours = formData.durationMinutes
    ? Math.floor(formData.durationMinutes / 60)
    : 0;
  const minutes = formData.durationMinutes ? formData.durationMinutes % 60 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionDate">Session Date *</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Duration *</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Hours"
                      min="0"
                      max="12"
                      value={hours}
                      onChange={(e) =>
                        handleDurationChange(
                          parseInt(e.target.value) || 0,
                          minutes
                        )
                      }
                    />
                  </div>
                  <span className="text-2xl text-gray-400 self-center">:</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) =>
                        handleDurationChange(
                          hours,
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.completed}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, completed: checked })
                }
              />
              <Label htmlFor="completed" className="cursor-pointer">
                Mark as completed
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Additional Information
            </h3>

            <div>
              <Label htmlFor="complications">Complications</Label>
              <Input
                id="complications"
                placeholder="Any complications during the session"
                value={formData.complications}
                onChange={(e) =>
                  setFormData({ ...formData, complications: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or observations"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
