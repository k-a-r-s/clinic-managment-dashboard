import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader } from "../../../components/ui/loader";
import { toast } from "react-hot-toast";
import { getPatients } from "../../patients/api/patients.api";
import {
  createDialysisPatient,
  createDialysisProtocol,
} from "../api/dialysis.api";
import type { Patient } from "../../patients/types/patient.types";

interface AddPatientToDialysisProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AddPatientToDialysis({
  onBack,
  onSuccess,
}: AddPatientToDialysisProps) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [dialysisType, setDialysisType] = useState<
    "hemodialysis" | "peritoneal"
  >("hemodialysis");
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(240);
  const [accessType, setAccessType] = useState<
    "fistula" | "catheter" | "graft"
  >("fistula");
  const [targetWeight, setTargetWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // Load patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Failed to load patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter((p) =>
        `${p.firstName} ${p.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    if (!targetWeight || parseFloat(targetWeight) <= 0) {
      toast.error("Please enter a valid target weight");
      return;
    }

    try {
      setIsLoading(true);

      // Create dialysis patient
      const dialysisPatient = await createDialysisPatient({
        patientId: selectedPatient,
        startDate: new Date().toISOString().split("T")[0],
        status: "active",
      });

      // Create protocol
      await createDialysisProtocol({
        dialysisPatientId: dialysisPatient.id,
        dialysisType,
        sessionsPerWeek,
        sessionDurationMinutes: sessionDuration,
        accessType,
        targetWeightKg: parseFloat(targetWeight),
      });

      toast.success("Patient added to dialysis program successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to add patient to dialysis:", error);
      toast.error("Failed to add patient to dialysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack}>
              Dialysis Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Patient to Dialysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <PageHeader
        title="Add Patient to Dialysis Program"
        subtitle="Enroll a patient into the dialysis program and set initial protocol"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Patient Selection */}
        <div className="space-y-2">
          <Label htmlFor="patient">Select Patient *</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mb-2"
            />
          </div>
          <Select
            value={selectedPatient}
            onValueChange={setSelectedPatient}
            disabled={isLoadingPatients}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingPatients ? "Loading patients..." : "Choose a patient"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredPatients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Initial Protocol Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Initial Dialysis Protocol
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dialysisType">Dialysis Type *</Label>
              <Select
                value={dialysisType}
                onValueChange={(value: "hemodialysis" | "peritoneal") =>
                  setDialysisType(value)
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
                value={accessType}
                onValueChange={(value: "fistula" | "catheter" | "graft") =>
                  setAccessType(value)
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
                value={sessionsPerWeek}
                onChange={(e) =>
                  setSessionsPerWeek(parseInt(e.target.value) || 1)
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
                value={sessionDuration}
                onChange={(e) =>
                  setSessionDuration(parseInt(e.target.value) || 180)
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
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="e.g., 70.5"
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add to Dialysis Program"}
          </Button>
        </div>
      </form>
    </div>
  );
}
