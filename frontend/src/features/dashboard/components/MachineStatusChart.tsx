"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getMachineStats } from "../api/stats.api";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function MachineStatusChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getMachineStats();
        const total = stats.total || 1; // Prevent division by zero

        const chartData: ChartData[] = [
          {
            name: "In Use",
            value: Math.round((stats.In_Use / total) * 100),
            color: "#2563eb",
          },
          {
            name: "Available",
            value: Math.round((stats.Available / total) * 100),
            color: "#16a34a",
          },
          {
            name: "Out of Service",
            value: Math.round((stats.Out_of_Service / total) * 100),
            color: "#ef4444",
          },
          {
            name: "Maintenance",
            value: Math.round((stats.Maintenance / total) * 100),
            color: "#f59e0b",
          },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch machine stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Machine Status Overview
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Machine Status Overview
      </h3>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-foreground">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
