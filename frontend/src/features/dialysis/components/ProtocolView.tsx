import { useState } from "react";
import { Activity, Settings2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { DialysisProtocol } from "../../../types/dialysis.types";
import { EditProtocolModal } from "./EditProtocolModal";

interface ProtocolViewProps {
  protocol: DialysisProtocol;
  patientName: string;
  onProtocolUpdated?: () => void;
}

export function ProtocolView({
  protocol,
  patientName,
  onProtocolUpdated,
}: ProtocolViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getAccessTypeBadge = (accessType: string) => {
    const colors = {
      fistula: "bg-green-100 text-green-800",
      catheter: "bg-yellow-100 text-yellow-800",
      graft: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge className={colors[accessType as keyof typeof colors] || ""}>
        {accessType.charAt(0).toUpperCase() + accessType.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Current Dialysis Protocol
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Active protocol for {patientName}
          </p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Protocol
        </Button>
      </div>

      {/* Protocol Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Dialysis Type</p>
              <p className="font-semibold capitalize">
                {protocol.dialysisType}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sessions Per Week</p>
              <p className="font-semibold">{protocol.sessionsPerWeek}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Session Duration</p>
              <p className="font-semibold">
                {protocol.sessionDurationMinutes} minutes
              </p>
            </div>
            {protocol.dialysisDays && protocol.dialysisDays.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Dialysis Days</p>
                <div className="flex flex-wrap gap-1">
                  {protocol.dialysisDays.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clinical Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Clinical Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Access Type</p>
              {getAccessTypeBadge(protocol.accessType)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Weight</p>
              <p className="font-semibold">{protocol.targetWeightKg} kg</p>
            </div>
            {protocol.bloodFlow && (
              <div>
                <p className="text-sm text-gray-500">Blood Flow</p>
                <p className="font-semibold">{protocol.bloodFlow} mL/min</p>
              </div>
            )}
            {protocol.anticoagulation && (
              <div>
                <p className="text-sm text-gray-500">Anticoagulation</p>
                <p className="font-semibold">{protocol.anticoagulation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment (if hemodialysis) */}
        {protocol.dialysisType === "hemodialysis" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {protocol.generator && (
                  <div>
                    <p className="text-sm text-gray-500">Generator</p>
                    <p className="font-semibold">{protocol.generator}</p>
                  </div>
                )}
                {protocol.dialyser && (
                  <div>
                    <p className="text-sm text-gray-500">Dialyser</p>
                    <p className="font-semibold">{protocol.dialyser}</p>
                  </div>
                )}
                {protocol.needle && (
                  <div>
                    <p className="text-sm text-gray-500">Needle Size</p>
                    <p className="font-semibold">{protocol.needle}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Edit Protocol Modal */}
      <EditProtocolModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        protocol={protocol}
        patientName={patientName}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onProtocolUpdated?.();
        }}
      />
    </div>
  );
}
