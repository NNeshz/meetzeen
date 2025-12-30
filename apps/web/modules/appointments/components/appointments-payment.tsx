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
import {
  useChangePaymentStatus,
  useChangePaymentMethod,
} from "@/modules/appointments/hooks/use-appointments";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import { PAYMENT_STATUS_OPTIONS } from "@/modules/appointments/constants/payment-status";
import { PAYMENT_METHOD_OPTIONS } from "@/modules/appointments/constants/payment-method";

interface AppointmentsPaymentProps {
  appointmentId: string;
  currentPaymentStatus?: string;
  currentPaymentMethod?: string;
  onSuccess?: () => void;
}

export function AppointmentsPayment({
  appointmentId,
  currentPaymentStatus,
  currentPaymentMethod,
  onSuccess,
}: AppointmentsPaymentProps) {
  const [open, setOpen] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
    currentPaymentStatus || ""
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    currentPaymentMethod || ""
  );

  const { mutate: changePaymentStatus, isPending: isPendingStatus } =
    useChangePaymentStatus({
      onSuccess: () => {
        toast.success("Estado de pago actualizado exitosamente");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Error al cambiar el estado de pago", {
          description:
            error instanceof Error ? error.message : "Intenta de nuevo",
        });
        setSelectedPaymentStatus(currentPaymentStatus || "");
      },
    });

  const { mutate: changePaymentMethod, isPending: isPendingMethod } =
    useChangePaymentMethod({
      onSuccess: () => {
        toast.success("Método de pago actualizado exitosamente");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Error al cambiar el método de pago", {
          description:
            error instanceof Error ? error.message : "Intenta de nuevo",
        });
        setSelectedPaymentMethod(currentPaymentMethod || "");
      },
    });

  useEffect(() => {
    if (currentPaymentStatus) {
      setSelectedPaymentStatus(currentPaymentStatus);
    }
  }, [currentPaymentStatus]);

  useEffect(() => {
    if (currentPaymentMethod) {
      setSelectedPaymentMethod(currentPaymentMethod);
    }
  }, [currentPaymentMethod]);

  const handlePaymentStatusChange = (newStatus: string) => {
    if (newStatus !== currentPaymentStatus) {
      setSelectedPaymentStatus(newStatus);
      changePaymentStatus({
        id: appointmentId,
        status: newStatus,
      });
    }
  };

  const handlePaymentMethodChange = (newMethod: string) => {
    if (newMethod !== currentPaymentMethod) {
      setSelectedPaymentMethod(newMethod);
      changePaymentMethod({
        id: appointmentId,
        method: newMethod,
      });
    }
  };

  const isPending = isPendingStatus || isPendingMethod;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <IconEdit className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Cambiar información de pago</SheetTitle>
          <SheetDescription>
            Actualiza el estado y método de pago. Los cambios se guardan automáticamente.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-status-select">Estado de pago</Label>
            <Select
              onValueChange={handlePaymentStatusChange}
              value={selectedPaymentStatus}
              disabled={isPending}
            >
              <SelectTrigger id="payment-status-select" className="w-full">
                <SelectValue placeholder="Selecciona un estado de pago" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method-select">Método de pago</Label>
            <Select
              onValueChange={handlePaymentMethodChange}
              value={selectedPaymentMethod}
              disabled={isPending}
            >
              <SelectTrigger id="payment-method-select" className="w-full">
                <SelectValue placeholder="Selecciona un método de pago" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPending && (
            <p className="text-sm text-muted-foreground">
              Guardando...
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

