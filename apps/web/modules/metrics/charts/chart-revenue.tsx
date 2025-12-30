"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@meetzeen/ui/src/components/chart";

const chartData = [
  { date: "2024-04-01", present: 222, past: 200 },
  { date: "2024-04-02", present: 97, past: 80 },
  { date: "2024-04-03", present: 167, past: 150 },
  { date: "2024-04-04", present: 242, past: 200 },
  { date: "2024-04-05", present: 373, past: 300 },
  { date: "2024-04-06", present: 301, past: 250 },
  { date: "2024-04-07", present: 245, past: 200 },
  { date: "2024-04-08", present: 409, past: 350 },
  { date: "2024-04-09", present: 59, past: 50 },
  { date: "2024-04-10", present: 261, past: 220 },
  { date: "2024-04-11", present: 327, past: 270 },
  { date: "2024-04-12", present: 292, past: 240 },
  { date: "2024-04-13", present: 342, past: 280 },
  { date: "2024-04-14", present: 137, past: 110 },
  { date: "2024-04-15", present: 120, past: 100 },
  { date: "2024-04-16", present: 138, past: 110 },
  { date: "2024-04-17", present: 446, past: 360 },
];

const chartConfig = {
  present: {
    label: "Este mes",
    color: "hsl(142, 76%, 36%)",
  },
  past: {
    label: "Pasado",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ingresos
          </CardTitle>
          <CardDescription className="text-4xl font-semibold text-primary">
            $1040
          </CardDescription>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(142,76%,36%)]" />
              <span>Este mes</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(221,83%,53%)]" />
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
            data={chartData}
            className="text-red-500"
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid
              vertical={true}
              strokeDasharray="4 4"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={{
                stroke: "hsl(var(--foreground))",
                strokeWidth: 2,
                strokeDasharray: "0",
                opacity: 0.2,
              }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    const label = chartConfig[name as keyof typeof chartConfig]?.label || name;
                    return (
                      <>
                        <span className="font-medium">{label}:</span>
                        <span className="ml-2 font-semibold">
                          ${Number(value).toLocaleString()}
                        </span>
                      </>
                    );
                  }}
                />
              }
            />
            <Line
              dataKey="present"
              type="monotone"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              dataKey="past"
              type="monotone"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}