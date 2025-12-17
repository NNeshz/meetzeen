"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSlugSteps } from "@/modules/slug/store/slug-steps";
import { useCompanyServicesStore } from "@/modules/slug/store/service-store";
import { useEmployeeSelectionStore } from "@/modules/slug/store/employee-store";

export function CompanyButtons() {
  const { previousStep, nextStep, steps } = useSlugSteps();
  const { services } = useCompanyServicesStore();
  const { selectedTimeSlot } = useEmployeeSelectionStore();

  const hasServices = services.length > 0;
  const hasTimeSlot = !!selectedTimeSlot;

  if (steps === 1) {
    return (
      <div className="sticky bottom-0 z-50 py-4 mt-4">
        <div className="flex justify-between max-w-4xl mx-auto px-4 lg:px-0">
          <div />
          <Button variant="brand" onClick={nextStep} disabled={!hasServices}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }

  if (steps === 2) {
    return (
      <div className="sticky bottom-0 z-50 py-4 mt-4">
        <div className="flex justify-between max-w-4xl mx-auto px-4 lg:px-0">
          <Button variant="brand" onClick={previousStep}>
            <IconArrowLeft />
            Anterior
          </Button>
          <Button variant="brand" onClick={nextStep} disabled={!hasTimeSlot}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }

  if (steps === 3) {
    return (
      <div className="sticky bottom-0 z-50 py-4 mt-4">
        <div className="flex justify-between max-w-4xl mx-auto px-4 lg:px-0">
          <Button variant="brand" onClick={previousStep}>
            Anterior
          </Button>
          <Button variant="brand" onClick={nextStep}>
            Confirmar
          </Button>
        </div>
      </div>
    );
  }
}
