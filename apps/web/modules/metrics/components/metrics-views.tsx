"use client";

import { useMetricsStore } from "@/modules/metrics/store/metrics-store";
import { OverviewCards } from "@/modules/metrics/overview/overview-cards";
import { ChartAreaInteractive } from "@/modules/metrics/charts/chart-revenue";

export function MetricsViews() {
  const { page } = useMetricsStore();
  if (page === "overview") {
    return <OverviewCards />;
  }
  if (page === "charts") {
    return (
      <div>
        <ChartAreaInteractive />
      </div>
    );
  }
  return null;
}
