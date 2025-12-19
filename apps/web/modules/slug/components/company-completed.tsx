"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useEmployeeSelectionStore } from "@/modules/slug/store/employee-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/components/card";
import { IconCheck, IconCalendar, IconClock } from "@tabler/icons-react";
import { Button } from "@meetzeen/ui/src/components/button";
import Link from "next/link";

export function CompanyCompleted() {
  const { selectedDate, selectedTimeSlot } = useEmployeeSelectionStore();

  // Disparar confetti automáticamente al renderizar
  useEffect(() => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="border">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-4">
                <IconCheck className="size-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-semibold">
              ¡Reserva creada exitosamente!
            </CardTitle>
            <CardDescription className="text-base">
              Tu reserva ha sido confirmada y está lista
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información de la reserva */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <IconCalendar className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Fecha
                  </p>
                  <p className="text-base font-semibold">
                    {formattedDate || "Fecha no disponible"}
                  </p>
                </div>
              </div>

              {selectedTimeSlot && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <IconClock className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Hora
                    </p>
                    <p className="text-base font-semibold">{selectedTimeSlot}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje de agradecimiento */}
            <div className="text-center space-y-2 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Te esperamos en la fecha y hora indicadas.
              </p>
              <p className="text-sm font-medium">
                ¡Gracias por tu reserva!
              </p>
            </div>

            {/* Botón de acción */}
            <div className="flex justify-center pt-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
