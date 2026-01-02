"use client";

import { Users, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getStats } from "../api/stats.api";
import type { DashboardStats } from "../api/stats.api";

export default function StatCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Users,
      label: "Total Patients",
      value: stats?.totalPatients?.toString() || "0",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-400",
    },
    {
      icon: Activity,
      label: "Active Sessions Today",
      value: stats?.activeSessions?.toString() || "0",
      bgColor: "bg-green-50",
      iconColor: "text-green-400",
    },
    {
      icon: Zap,
      label: "Available Machines",
      value: stats?.activemachines?.toString() || "0",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-border p-6 animate-pulse"
          >
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
