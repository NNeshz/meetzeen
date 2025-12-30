"use client";

import { useMetricsStore } from "@/modules/metrics/store/metrics-store";
import { OverviewCards } from "@/modules/metrics/overview/overview-cards";
import { ChartRevenue } from "@/modules/metrics/charts/chart-revenue";
import { ChartWorkdays } from "@/modules/metrics/charts/chart-workdays";
import { ChartNewClients } from "@/modules/metrics/charts/chart-new-clients";

export function MetricsViews() {
  const { page } = useMetricsStore();
  if (page === "overview") {
    return <OverviewCards />;
  }
  if (page === "charts") {
    return (
      <div className="flex flex-col gap-4">
        <ChartRevenue />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartWorkdays />
          <ChartNewClients />
        </div>
      </div>
    );
  }
  return null;
}
