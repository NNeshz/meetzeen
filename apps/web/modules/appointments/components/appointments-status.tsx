"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/src/components/select";
import { Label } from "@meetzeen/ui/src/components/label";
import { useChangeAppointmentStatus } from "@/modules/appointments/hooks/use-appointments";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import { APPOINTMENT_STATUS_OPTIONS } from "@/modules/appointments/constants/appointment-status";

interface AppointmentsStatusProps {
  appointmentId: string;
  currentStatus?: string;
  onSuccess?: () => void;
}

export function AppointmentsStatus({
  appointmentId,
  currentStatus,
  onSuccess,
}: AppointmentsStatusProps) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "");

  const { mutate: changeAppointmentStatus, isPending } =
    useChangeAppointmentStatus({
      onSuccess: () => {
        toast.success("Estado actualizado exitosamente");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Error al cambiar el estado", {
          description:
            error instanceof Error ? error.message : "Intenta de nuevo",
        });
        setSelectedStatus(currentStatus || "");
      },
    });

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== currentStatus) {
      setSelectedStatus(newStatus);
      changeAppointmentStatus({
        id: appointmentId,
        status: newStatus,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <IconEdit className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Cambiar estado de la cita</SheetTitle>
          <SheetDescription>
            Selecciona el nuevo estado para esta cita. Los cambios se guardan automáticamente.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="status-select">Estado</Label>
            <Select
              onValueChange={handleStatusChange}
              value={selectedStatus}
              disabled={isPending}
            >
              <SelectTrigger id="status-select" className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isPending && (
              <p className="text-sm text-muted-foreground">
                Guardando...
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
