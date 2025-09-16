"use client"

import { Button } from "@meetzeen/ui/src/components/button";
import { useStepsStore } from "../store/useStepsStore";

export function Schedule() {
  
  const { prevStep, nextStep } = useStepsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Horarios Disponibles</h2>
      <div className="flex justify-between">
        <Button onClick={prevStep} size={"sm"} variant={"outline"}>
          Anterior
        </Button>
        <Button onClick={nextStep} size={"sm"}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
