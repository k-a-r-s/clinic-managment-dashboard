import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Phone } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getPatients } from "../api/patients.api";
import { toast } from "react-hot-toast";
import type { Patient } from "../../../types";

// Utility function to calculate age from birth date
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

interface PatientsListPageProps {
  onViewPatient?: (patientId: number) => void;
  onEditPatient?: (patientId: number) => void;
  onRegisterNew?: () => void;
}

export function PatientsList({
  onViewPatient,
  onEditPatient,
  onRegisterNew,
}: PatientsListPageProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const data = await getPatients();
      console.log("Loaded patients:", data);
      if (data.length > 0) {
        console.log("First patient sample:", data[0]);
      }
      setPatients(data);
    } catch (error) {
      console.error("Failed to load patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm) ||
      patient.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleViewPatient = (patientId: number) => {
    if (onViewPatient) {
      onViewPatient(patientId);
    }
  };

  const handleEditPatient = (patientId: number) => {
    if (onEditPatient) {
      onEditPatient(patientId);
    }
  };

  const handleRegisterNew = () => {
    if (onRegisterNew) {
      onRegisterNew();
    }
  };

  const patientColumns: Column<Patient>[] = [
    {
      key: "id",
      header: "ID",
      render: (patient) => (
        <span className="font-mono text-xs text-gray-600">#{patient.id}</span>
      ),
    },
    {
      key: "name",
      header: "Patient",
      render: (patient) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-xs text-gray-500">{patient.email}</p>
        </div>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      render: (patient) => {
        // Handle both camelCase and snake_case from API
        const gender = patient.gender || (patient as any).gender;
        return (
          <span className="text-sm text-gray-600 capitalize">
            {gender || "N/A"}
          </span>
        );
      },
    },
    {
      key: "age",
      header: "Age",
      render: (patient) => {
        // Handle both camelCase and snake_case from API
        const birthDate = patient.birthDate || (patient as any).birth_date;
        if (!birthDate)
          return <span className="text-sm text-gray-400">N/A</span>;
        const age = calculateAge(birthDate);
        return <span className="text-sm text-gray-600">{age} years</span>;
      },
    },
    {
      key: "contact",
      header: "Contact",
      render: (patient) => (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Phone className="w-3 h-3" />
          {patient.phoneNumber}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-left",
      render: (patient) => (
        <div className="flex items-center justify-start gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPatient(patient.id);
            }}
            className="gap-1 text-[#1C8CA8] hover:bg-teal-50 hover:text-[#157A93]"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPatient(patient.id);
            }}
            className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <PageHeader title="Patients Management" />

      {/* Main White Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search and Statistics Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-6">
            <SearchBar
              placeholder="Search by name, patient ID, or phone..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleRegisterNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Register New Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredPatients}
              columns={patientColumns}
              getRowKey={(patient) => patient.id}
              selectedKey={selectedPatientId}
              onRowClick={(patient) => setSelectedPatientId(patient.id)}
              emptyMessage="No patients found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">
              Previous
            </Button>
            <Button size="sm" className="bg-[#1C8CA8] hover:bg-[#157A93]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
