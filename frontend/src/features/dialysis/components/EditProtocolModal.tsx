import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { toast } from "react-hot-toast";
import type {
  DialysisProtocol,
  ProtocolFormData,
} from "../../../types/dialysis.types";
import { updateDialysisProtocol } from "../api/dialysis.api";

interface EditProtocolModalProps {
  open: boolean;
  onClose: () => void;
  protocol: DialysisProtocol;
  patientName: string;
  onSuccess?: () => void;
}

export function EditProtocolModal({
  open,
  onClose,
  protocol,
  patientName,
  onSuccess,
}: EditProtocolModalProps) {
  const [formData, setFormData] = useState<ProtocolFormData>({
    dialysisType: protocol.dialysisType,
    sessionsPerWeek: protocol.sessionsPerWeek,
    sessionDurationMinutes: protocol.sessionDurationMinutes,
    accessType: protocol.accessType,
    targetWeightKg: protocol.targetWeightKg,
    notes: protocol.notes || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.sessionsPerWeek < 1 || formData.sessionsPerWeek > 7) {
      toast.error("Sessions per week must be between 1 and 7");
      return;
    }

    if (formData.sessionDurationMinutes < 1) {
      toast.error("Session duration must be positive");
      return;
    }

    if (formData.targetWeightKg && formData.targetWeightKg <= 0) {
      toast.error("Target weight must be positive");
      return;
    }

    try {
      setIsLoading(true);
      await updateDialysisProtocol(protocol.dialysisPatientId, formData);
      toast.success("Protocol updated successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update protocol:", error);
      toast.error("Failed to update protocol");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Dialysis Protocol</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Update dialysis protocol for {patientName}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Settings */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dialysisType">Dialysis Type *</Label>
              <Select
                value={formData.dialysisType}
                onValueChange={(value: "hemodialysis" | "peritoneal") =>
                  setFormData({ ...formData, dialysisType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hemodialysis">Hemodialysis</SelectItem>
                  <SelectItem value="peritoneal">
                    Peritoneal Dialysis
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessType">Access Type *</Label>
              <Select
                value={formData.accessType}
                onValueChange={(value: "fistula" | "catheter" | "graft") =>
                  setFormData({ ...formData, accessType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fistula">Fistula</SelectItem>
                  <SelectItem value="catheter">Catheter</SelectItem>
                  <SelectItem value="graft">Graft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionsPerWeek">Sessions Per Week *</Label>
              <Input
                id="sessionsPerWeek"
                type="number"
                min="1"
                max="7"
                value={formData.sessionsPerWeek}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sessionsPerWeek: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDuration">
                Session Duration (minutes) *
              </Label>
              <Input
                id="sessionDuration"
                type="number"
                min="1"
                value={formData.sessionDurationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sessionDurationMinutes: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (kg) *</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                min="0"
                value={formData.targetWeightKg}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetWeightKg: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                rows={3}
                placeholder="Any additional notes or observations..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
