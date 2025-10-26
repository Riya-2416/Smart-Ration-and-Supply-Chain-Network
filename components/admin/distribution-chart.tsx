"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const distributionData = [
  { month: "Jan", rice: 4000, wheat: 3000, sugar: 800, oil: 600 },
  { month: "Feb", rice: 4200, wheat: 3200, sugar: 850, oil: 650 },
  { month: "Mar", rice: 3800, wheat: 2800, sugar: 750, oil: 580 },
  { month: "Apr", rice: 4500, wheat: 3400, sugar: 900, oil: 700 },
  { month: "May", rice: 4300, wheat: 3300, sugar: 880, oil: 680 },
  { month: "Jun", rice: 4600, wheat: 3500, sugar: 920, oil: 720 },
]

export function DistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Distribution Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rice" fill="hsl(var(--chart-1))" name="Rice (tons)" />
            <Bar dataKey="wheat" fill="hsl(var(--chart-2))" name="Wheat (tons)" />
            <Bar dataKey="sugar" fill="hsl(var(--chart-3))" name="Sugar (tons)" />
            <Bar dataKey="oil" fill="hsl(var(--chart-4))" name="Oil (tons)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
