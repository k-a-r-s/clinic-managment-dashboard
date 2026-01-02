import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Pill, Calendar, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getPrescriptions } from "../api/prescriptions.api";
import { toast } from "react-hot-toast";
import type { Prescription } from "../../../types";

interface PrescriptionsListProps {
  onViewPrescription?: (prescriptionId: string) => void;
  onEditPrescription?: (prescriptionId: string) => void;
  onCreateNew?: () => void;
}

export function PrescriptionsList({
  onViewPrescription,
  onEditPrescription,
  onCreateNew,
}: PrescriptionsListProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true);
      const data = await getPrescriptions();
      console.log("Loaded prescriptions:", data);
      setPrescriptions(data);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = prescription.patientName?.toLowerCase() || "";
    const doctorName = prescription.doctorName?.toLowerCase() || "";
    const prescriptionId = prescription.id.toString().toLowerCase();
    const medications = prescription.medications
      .map((m) => m.medicationName.toLowerCase())
      .join(" ");

    const matchesSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase()) ||
      prescriptionId.includes(searchTerm.toLowerCase()) ||
      medications.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleViewPrescription = (prescriptionId: string) => {
    if (onViewPrescription) {
      onViewPrescription(prescriptionId);
    }
  };

  const handleEditPrescription = (prescriptionId: string) => {
    if (onEditPrescription) {
      onEditPrescription(prescriptionId);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const prescriptionColumns: Column<Prescription>[] = [
    {
      key: "id",
      header: "ID",
      render: (prescription) => (
        <span className="font-mono text-xs text-gray-600">
          #{prescription.id}
        </span>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (prescription) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {prescription.patientName}
          </span>
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      render: (prescription) => (
        <span className="text-sm text-gray-700">{prescription.doctorName}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (prescription) => (
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Calendar className="w-3 h-3 text-gray-400" />
          {new Date(prescription.prescriptionDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "medications",
      header: "Medications",
      render: (prescription) => (
        <div className="flex flex-wrap gap-1">
          {prescription.medications.slice(0, 2).map((med, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {med.medicationName}
            </Badge>
          ))}
          {prescription.medications.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{prescription.medications.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "medicationCount",
      header: "Items",
      render: (prescription) => (
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Pill className="w-3 h-3 text-gray-400" />
          {prescription.medications.length}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-left",
      render: (prescription) => (
        <div className="flex items-center justify-start gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPrescription(prescription.id);
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
              handleEditPrescription(prescription.id);
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
      <PageHeader title="Prescriptions Management" />

      {/* Main White Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search and Actions Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder="Search by patient, doctor, medication, or ID..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCreateNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                New Prescription
              </Button>
            </div>
          </div>
        </div>

        {/* Prescriptions Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredPrescriptions}
              columns={prescriptionColumns}
              getRowKey={(prescription) => prescription.id}
              selectedKey={selectedPrescriptionId}
              onRowClick={(prescription) =>
                setSelectedPrescriptionId(prescription.id)
              }
              emptyMessage="No prescriptions found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredPrescriptions.length} of {prescriptions.length}{" "}
            prescriptions
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
