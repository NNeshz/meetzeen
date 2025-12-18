"use client";

import { useEmployeeSelectionStore } from "@/modules/slug/store/employee-store";

export function CompanyCompleted() {
  const { selectedDate, selectedTimeSlot } = useEmployeeSelectionStore();

  return (
    <div>
      <h1>Reserva creada exitosamente</h1>
      <p>
        Tu reserva ha sido creada exitosamente.
      </p>
      <p>
        Te esperamos el {selectedDate?.toLocaleDateString()} a las {selectedTimeSlot}.
      </p>
      <p>
        Gracias por tu reserva.
      </p>
    </div>
  );
}