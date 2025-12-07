"use client";

import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { Button } from "@meetzeen/ui/src/components/button";
import { useState } from "react";

const DAYS = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miercoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sabado" },
  { value: "sunday", label: "Domingo" },
];

export function CompanyWorkdays() {
  const [currentDays, setCurrentDays] = useState<string[]>([]);

  function toggleDay(day: string) {
    setCurrentDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Nombre de la empresa</p>
            <p className="text-sm text-muted-foreground">
              Este es el nombre de tu empresa. Puedes cambiarlo en cualquier
              momento.
            </p>
          </div>
          <ButtonGroup className="w-full max-w-md">
            <ButtonGroup className="w-full">
              {DAYS.map((d) => {
                const selected = currentDays.includes(d.value);
                return (
                  <Button
                    key={d.value}
                    type="button"
                    className="flex-1"
                    variant={selected ? "default" : "outline"}
                    onClick={() => toggleDay(d.value)}
                  >
                    {d.label}
                  </Button>
                );
              })}
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecciona los días de la semana en que tu empresa está abierta.
        </p>
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
