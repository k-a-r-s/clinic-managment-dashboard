import { useState, useEffect } from "react";
import { History, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Loader } from "../../../components/ui/loader";
import type { DialysisHistoryEntry } from "../../../types/dialysis.types";
import { getDialysisHistory } from "../api/dialysis.api";

interface DialysisHistoryViewProps {
  patientId: string;
  patientName: string;
}

export function DialysisHistoryView({
  patientId,
  patientName,
}: DialysisHistoryViewProps) {
  const [history, setHistory] = useState<DialysisHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [patientId]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisHistory(patientId);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load dialysis history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-gray-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dialysis History
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Protocol changes from medical file for {patientName} (read-only)
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Historical Snapshot Data</p>
          <p className="text-blue-700">
            This information is retrieved from the patient's medical file and
            represents historical protocol changes. For current dialysis
            information, see the "Current Protocol" and "Sessions" tabs.
          </p>
        </div>
      </div>

      {/* History Timeline */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No historical dialysis records found in medical file
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((entry, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    {entry.note && (
                      <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                    )}
                  </div>
                  <Badge className="capitalize" variant="outline">
                    {entry.dialysisType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Sessions/Week</p>
                    <p className="font-semibold">{entry.sessionsPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Session Duration</p>
                    <p className="font-semibold">
                      {entry.sessionDurationMinutes} min
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Access Type</p>
                    <p className="font-semibold capitalize">
                      {entry.accessType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
