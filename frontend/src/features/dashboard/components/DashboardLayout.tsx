import StatCards from "./StatCards";
import RevenueCards from "./RevenueCards";
import MachineStatusChart from "./MachineStatusChart";
import RecentAlerts from "./RecentAlerts";
import PatientVisitsChart from "./PatientVisitsChart";
import DialysisSessionsChart from "./DialysisSessionsChart";

export default function DashboardLayout() {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Dashboard Overview Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <StatCards />

      {/* Revenue Cards */}
      <RevenueCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MachineStatusChart />
        <RecentAlerts />
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientVisitsChart />
        <DialysisSessionsChart />
      </div>
    </div>
  );
}
