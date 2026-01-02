import { useState, useEffect } from "react";
import { Plus, Eye, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { DataTable } from "../../../components/shared/DataTable";
import { SearchBar } from "../../../components/shared/SearchBar";
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
  onAddPatient: () => void;
}

export function DialysisPatientsDashboard({
  onViewProtocol,
  onAddSession,
  onAddPatient,
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

  const columns = [
    {
      key: "patientName",
      header: "Patient Name",
      accessor: "patientName" as keyof DialysisPatient,
      render: (patient: DialysisPatient) => (
        <div className="font-medium text-gray-900">{patient.patientName}</div>
      ),
    },
    {
      key: "dialysisType",
      header: "Type",
      accessor: "dialysisType" as keyof DialysisPatient,
      render: (patient: DialysisPatient) =>
        getDialysisTypeBadge(patient.dialysisType),
    },
    {
      key: "sessionsPerWeek",
      header: "Sessions/Week",
      accessor: "sessionsPerWeek" as keyof DialysisPatient,
      render: (patient: DialysisPatient) => (
        <span className="text-gray-900">{patient.sessionsPerWeek}</span>
      ),
    },
    {
      key: "lastSessionDate",
      header: "Last Session",
      accessor: "lastSessionDate" as keyof DialysisPatient,
      render: (patient: DialysisPatient) => (
        <span className="text-gray-600">
          {patient.lastSessionDate
            ? new Date(patient.lastSessionDate).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: "status" as keyof DialysisPatient,
      render: (patient: DialysisPatient) => getStatusBadge(patient.status),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: "id" as keyof DialysisPatient,
      render: (patient: DialysisPatient) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProtocol(patient.id, patient.patientName)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Protocol
          </Button>
          <Button
            size="sm"
            onClick={() => onAddSession(patient.id, patient.patientName)}
            disabled={patient.status === "stopped"}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Session
          </Button>
        </div>
      ),
    },
  ];

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
        <Button onClick={onAddPatient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient to Dialysis
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by patient name, type, or status..."
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredPatients}
        getRowKey={(patient) => patient.id}
      />

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
