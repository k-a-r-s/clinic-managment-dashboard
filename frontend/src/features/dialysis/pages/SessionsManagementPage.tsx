import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { DataTable } from "../../../components/shared/DataTable";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Loader } from "../../../components/ui/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import type { DialysisSession } from "../../../types/dialysis.types";
import {
  getDialysisSessions,
  deleteDialysisSession,
} from "../api/dialysis.api";
import { toast } from "react-hot-toast";
import { EditSessionModal } from "../components/EditSessionModal";

interface SessionsManagementPageProps {
  dialysisPatientId: string;
  patientName: string;
  onBack: () => void;
  onAddSession: () => void;
}

export function SessionsManagementPage({
  dialysisPatientId,
  patientName,
  onBack,
  onAddSession,
}: SessionsManagementPageProps) {
  const [sessions, setSessions] = useState<DialysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<DialysisSession | null>(
    null
  );

  useEffect(() => {
    loadSessions();
  }, [dialysisPatientId]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisSessions(dialysisPatientId);
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Failed to load dialysis sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      await deleteDialysisSession(sessionId);
      toast.success("Session deleted successfully");
      loadSessions();
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  const handleEditSession = (session: DialysisSession) => {
    setEditingSession(session);
  };

  const handleCloseEditModal = () => {
    setEditingSession(null);
    loadSessions();
  };

  const getStatusBadge = (completed: boolean) => {
    return completed ? (
      <Badge className="bg-green-100 text-green-800">Completed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  const columns = [
    {
      key: "sessionDate",
      header: "Session Date",
      accessor: "sessionDate" as keyof DialysisSession,
      render: (session: DialysisSession) => (
        <div className="font-medium text-gray-900">
          {new Date(session.sessionDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "durationMinutes",
      header: "Duration",
      accessor: "durationMinutes" as keyof DialysisSession,
      render: (session: DialysisSession) => (
        <span className="text-gray-900">
          {session.durationMinutes
            ? `${Math.floor(session.durationMinutes / 60)}h ${
                session.durationMinutes % 60
              }m`
            : "—"}
        </span>
      ),
    },
    {
      key: "complications",
      header: "Complications",
      accessor: "complications" as keyof DialysisSession,
      render: (session: DialysisSession) => (
        <span className="text-gray-600">{session.complications || "—"}</span>
      ),
    },
    {
      key: "completed",
      header: "Status",
      accessor: "completed" as keyof DialysisSession,
      render: (session: DialysisSession) => getStatusBadge(session.completed),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: "id" as keyof DialysisSession,
      render: (session: DialysisSession) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditSession(session)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteSession(session.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
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
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack} className="cursor-pointer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack} className="cursor-pointer">
              Dialysis Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sessions - {patientName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <PageHeader
        title={`Dialysis Sessions - ${patientName}`}
        subtitle="View and manage all dialysis sessions"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={onAddSession}>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        }
      />

      {/* Sessions Table */}
      <DataTable
        columns={columns}
        data={sessions}
        getRowKey={(session) => session.id}
      />

      {sessions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            No dialysis sessions recorded yet
          </p>
          <Button onClick={onAddSession}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Session
          </Button>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
