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
  { month: "January", actual: 24, previous: 18 },
  { month: "February", actual: 31, previous: 22 },
  { month: "March", actual: 28, previous: 20 },
  { month: "April", actual: 19, previous: 25 },
  { month: "May", actual: 35, previous: 21 },
  { month: "June", actual: 42, previous: 28 },
];

const chartConfig = {
  actual: {
    label: "Este período",
    color: "var(--chart-1)",
  },
  previous: {
    label: "Período anterior",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartNewClients() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nuevos clientes
          </CardTitle>
          <CardDescription className="text-4xl font-semibold text-primary">
            179 clientes
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="previous"
              type="monotone"
              stroke="var(--color-previous)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
