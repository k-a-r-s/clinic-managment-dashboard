import { useState, useEffect } from "react";
import { Plus, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Loader } from "../../../components/ui/loader";
import type { DialysisSession } from "../../../types/dialysis.types";
import { getDialysisSessions } from "../api/dialysis.api";

interface SessionsListProps {
  dialysisPatientId: string;
  patientName: string;
  onAddSession?: () => void;
}

export function SessionsList({
  dialysisPatientId,
  patientName,
  onAddSession,
}: SessionsListProps) {
  const [sessions, setSessions] = useState<DialysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [dialysisPatientId]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisSessions(dialysisPatientId);
      // Sort by date descending
      const sorted = data.sort(
        (a, b) =>
          new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
      );
      setSessions(sorted);
    } catch (error) {
      console.error("Failed to load sessions:", error);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dialysis Sessions
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Session history for {patientName}
          </p>
        </div>
        <Button onClick={onAddSession}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No sessions recorded yet
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <CardTitle className="text-base">
                        {new Date(session.sessionDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {session.durationMinutes} minutes
                      </p>
                    </div>
                  </div>
                  {session.completed ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Vital Signs */}
                {(session.preWeight || session.postWeight) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {session.preWeight && (
                      <div>
                        <p className="text-gray-500">Pre-Weight</p>
                        <p className="font-semibold">{session.preWeight} kg</p>
                      </div>
                    )}
                    {session.postWeight && (
                      <div>
                        <p className="text-gray-500">Post-Weight</p>
                        <p className="font-semibold">{session.postWeight} kg</p>
                      </div>
                    )}
                  </div>
                )}

                {session.ultrafiltrationVolume && (
                  <div className="text-sm">
                    <p className="text-gray-500">Ultrafiltration</p>
                    <p className="font-semibold">
                      {session.ultrafiltrationVolume} L
                    </p>
                  </div>
                )}

                {/* Blood Pressure */}
                {(session.preSystolic || session.postSystolic) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {session.preSystolic && session.preDiastolic && (
                      <div>
                        <p className="text-gray-500">Pre-BP</p>
                        <p className="font-semibold">
                          {session.preSystolic}/{session.preDiastolic} mmHg
                        </p>
                      </div>
                    )}
                    {session.postSystolic && session.postDiastolic && (
                      <div>
                        <p className="text-gray-500">Post-BP</p>
                        <p className="font-semibold">
                          {session.postSystolic}/{session.postDiastolic} mmHg
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Complications */}
                {session.complications && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">
                      Complications
                    </p>
                    <p className="text-sm text-yellow-900">
                      {session.complications}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {session.notes && (
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-gray-600">{session.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
