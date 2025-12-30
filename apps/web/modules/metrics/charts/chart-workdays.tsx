"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@meetzeen/ui/components/chart";

const chartData = [
  { day: "Monday", appointments: 186, previousAppointments: 80 },
  { day: "Tuesday", appointments: 305, previousAppointments: 200 },
  { day: "Wednesday", appointments: 237, previousAppointments: 120 },
  { day: "Thursday", appointments: 73, previousAppointments: 190 },
  { day: "Friday", appointments: 209, previousAppointments: 130 },
  { day: "Saturday", appointments: 214, previousAppointments: 140 },
  { day: "Sunday", appointments: 214, previousAppointments: 140 },
];

const chartConfig = {
  appointments: {
    label: "Actual",
    color: "var(--chart-1)",
  },
  previousAppointments: {
    label: "Previous",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartWorkdays() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Días de trabajo
          </CardTitle>
          <CardDescription className="text-4xl font-semibold text-primary">
            7 días
          </CardDescription>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-chart-1" />
              <span>Este mes</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-chart-2" />
              <span>Pasado</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="appointments"
              type="monotone"
              stroke="var(--color-appointments)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="previousAppointments"
              type="monotone"
              stroke="var(--color-previousAppointments)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
