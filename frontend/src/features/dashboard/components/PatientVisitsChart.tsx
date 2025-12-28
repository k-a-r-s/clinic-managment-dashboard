"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getPatientVisistsStats } from "../api/dashboard.api" // your API call
import type { patientsperDay } from "../../../types"

type ChartData = {
  name: string
  visits: number
}

export default function PatientVisitsChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: patientsperDay[] = await getPatientVisistsStats()

        // 🔹 Map API data to chart format
        const mappedData: ChartData[] = res.map((item) => ({
          name: formatDay(item.date), // or item.day
          visits: item.count,
        }))

        setData(mappedData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Patient Visits This Week
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#2563eb"
              dot={{ fill: "#2563eb", r: 5 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// 🔹 Optional helper to convert date → weekday
function formatDay(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // Mon, Tue, Wed
  })
}
