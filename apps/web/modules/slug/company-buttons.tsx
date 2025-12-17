"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSlugSteps } from "@/modules/slug/store/slug-steps";
import { useCompanyServicesStore } from "@/modules/slug/store/service-store";

export function CompanyButtons() {
  const { previousStep, nextStep, steps } = useSlugSteps();
  const { services } = useCompanyServicesStore();

  const hasServices = services.length > 0;

  if (steps === 1) {
    return (
      <div className="flex justify-between max-w-4xl mx-auto mt-4">
        <div />
        <Button variant="outline" onClick={nextStep} disabled={!hasServices}>
          Siguiente
        </Button>
      </div>
    );
  }

  if (steps === 2) {
    return (
      <div className="flex justify-between max-w-4xl mx-auto mt-4">
        <Button variant="outline" onClick={previousStep}>
          <IconArrowLeft />
          Anterior
        </Button>
        <Button variant="outline" onClick={nextStep}>
          Siguiente
        </Button>
      </div>
    );
  }
}
