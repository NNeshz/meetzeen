"use client";

import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { Button } from "@meetzeen/ui/src/components/button";
import { useMetricsStore } from "@/modules/metrics/store/metrics-store";

export function MetricsFilterPages() {
  const { page, setPage } = useMetricsStore();

  return (
    <ButtonGroup>
      <Button
        onClick={() => setPage("overview")}
        variant={page === "overview" ? "brand" : "outline"}
      >
        Resumen
      </Button>
      <Button
        onClick={() => setPage("charts")}
        variant={page === "charts" ? "brand" : "outline"}
      >
        Gráficos
      </Button>
    </ButtonGroup>
  );
}
