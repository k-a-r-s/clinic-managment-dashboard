import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import type { DialysisIncident } from "../../../types/dialysis.types";

interface IncidentsListProps {
  incidents: DialysisIncident[];
  onIncidentAdded?: () => void;
}

export function IncidentsList({ incidents }: IncidentsListProps) {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No incidents recorded for this session</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      mild: "bg-yellow-50 text-yellow-700 border-yellow-300",
      moderate: "bg-orange-50 text-orange-700 border-orange-300",
      severe: "bg-red-50 text-red-700 border-red-300",
    };

    return (
      <Badge
        variant="outline"
        className={colors[severity as keyof typeof colors] || colors.mild}
      >
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      hypotension: "bg-red-100 text-red-800",
      cramps: "bg-purple-100 text-purple-800",
      clotting: "bg-pink-100 text-pink-800",
      nausea: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.other}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTypeBadge(incident.type)}
              {getSeverityBadge(incident.severity)}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              {incident.timeOccurred}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-sm text-gray-600">{incident.description}</p>
            </div>

            {incident.resolution && (
              <div>
                <p className="text-sm font-medium text-gray-700">Resolution</p>
                <p className="text-sm text-green-700">{incident.resolution}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
