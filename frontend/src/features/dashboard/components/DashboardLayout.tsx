import StatCards from "./StatCards";
import MachineStatusChart from "./MachineStatusChart";
import PatientVisitsChart from "./PatientVisitsChart";
import DialysisSessionsChart from "./DialysisSessionsChart";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Dashboard Overview Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back{user ? `, ${user.firstName} ${user.lastName}` : ""}!
          Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <StatCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <MachineStatusChart />
        <PatientVisitsChart />
      </div>

      {/* Bottom Chart */}
      <div className="grid grid-cols-1 gap-6">
        <DialysisSessionsChart />
      </div>
    </div>
  );
}
