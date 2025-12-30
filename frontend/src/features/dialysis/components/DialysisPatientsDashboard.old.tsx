import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Loader } from "../../../components/ui/loader";
import type { DialysisPatient } from "../../../types/dialysis.types";
import {
  getDialysisPatients,
  updateDialysisPatientStatus,
} from "../api/dialysis.api";
import { toast } from "react-hot-toast";

interface DialysisPatientsDashboardProps {
  onViewProtocol: (dialysisPatientId: string, patientName: string) => void;
  onAddSession: (dialysisPatientId: string, patientName: string) => void;
}

export function DialysisPatientsDashboard({
  onViewProtocol,
  onAddSession,
}: DialysisPatientsDashboardProps) {
  const [patients, setPatients] = useState<DialysisPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<DialysisPatient[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(
        (patient) =>
          patient.patientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          patient.dialysisType
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          patient.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Failed to load dialysis patients:", error);
      toast.error("Failed to load dialysis patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseResume = async (patient: DialysisPatient) => {
    const newStatus = patient.status === "active" ? "paused" : "active";
    try {
      await updateDialysisPatientStatus(patient.id, newStatus);
      toast.success(
        `Dialysis ${newStatus === "active" ? "resumed" : "paused"} for ${
          patient.patientName
        }`
      );
      loadPatients();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "stopped":
        return <Badge className="bg-red-100 text-red-800">Stopped</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDialysisTypeBadge = (type: string) => {
    return type === "hemodialysis" ? (
      <Badge className="bg-blue-100 text-blue-800">Hemodialysis</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">Peritoneal</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dialysis Patients
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all patients undergoing dialysis treatment
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by patient name, type, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {patient.patientName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getDialysisTypeBadge(patient.dialysisType)}
                    {getStatusBadge(patient.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Sessions/Week</p>
                  <p className="font-semibold">{patient.sessionsPerWeek}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Sessions</p>
                  <p className="font-semibold">{patient.totalSessions || 0}</p>
                </div>
              </div>

              {patient.lastSessionDate && (
                <div className="text-sm">
                  <p className="text-gray-500">Last Session</p>
                  <p className="font-medium">
                    {new Date(patient.lastSessionDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {patient.nextSessionDate && patient.status === "active" && (
                <div className="text-sm">
                  <p className="text-gray-500">Next Session</p>
                  <p className="font-medium text-blue-600">
                    {new Date(patient.nextSessionDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    onViewProtocol(patient.id, patient.patientName)
                  }
                >
                  View Protocol
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onAddSession(patient.id, patient.patientName)}
                  disabled={patient.status === "stopped"}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Session
                </Button>
              </div>

              {patient.status !== "stopped" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handlePauseResume(patient)}
                >
                  {patient.status === "active"
                    ? "Pause Dialysis"
                    : "Resume Dialysis"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No patients found matching your search"
              : "No dialysis patients registered yet"}
          </p>
        </div>
      )}
    </div>
  );
}
