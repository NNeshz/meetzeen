"use client"

import { Button } from "@meetzeen/ui/src/components/button";
import { useStepsStore } from "../store/useStepsStore";
import { useBookingStore } from "../store/useBookingStore";
import { useEffect } from "react";

export function Schedule() {
  
  const { prevStep, nextStep } = useStepsStore();
  const { availabilityData } = useBookingStore();

  useEffect(() => {
    if (availabilityData) {
      console.log("Respuesta de checkAvailability:", availabilityData);
    }
  }, [availabilityData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Horarios Disponibles</h2>
      
      {availabilityData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Datos de Disponibilidad:</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-auto">
            {JSON.stringify(availabilityData, null, 2)}
          </pre>
        </div>
      )}
      
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