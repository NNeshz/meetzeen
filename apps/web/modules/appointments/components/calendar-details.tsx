"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
import { Badge } from "@meetzeen/ui/components/badge";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useAppointmentById } from "@/modules/appointments/hooks/use-appointments";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Separator } from "@meetzeen/ui/components/separator";
import { AppointmentsStatus } from "@/modules/appointments/components/appointments-status";
import { AppointmentsPayment } from "@/modules/appointments/components/appointments-payment";
import { APPOINTMENT_STATUS_LABELS } from "@/modules/appointments/constants/appointment-status";
import { PAYMENT_STATUS_LABELS } from "@/modules/appointments/constants/payment-status";
import { PAYMENT_METHOD_LABELS } from "@/modules/appointments/constants/payment-method";
import {
  getAppointmentStatusBadgeColor,
  getPaymentStatusBadgeColor,
  getPaymentMethodBadgeColor,
} from "@/modules/appointments/utils/badge-color";

function safeFormatDate(dateValue: string | Date | null | undefined, formatStr: string, fallback = "Sin fecha"): string {
  if (!dateValue) return fallback;
  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    if (!isValid(date)) return fallback;
    return format(date, formatStr, { locale: es });
  } catch {
    return fallback;
  }
}

interface ServiceBooked {
  id?: string;
  serviceName: string;
  servicePrice: string;
  serviceDuration: number;
  serviceDiscount?: number | null;
  serviceTotal?: string;
  serviceDiscountTotal?: string;
  order?: number;
}

interface AppointmentSheetProps {
  variant?: "default" | "outline";
  className?: string;
  text?: string;
  appointmentId?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
}

export function AppointmentSheet({
  variant = "default",
  text,
  className,
  appointmentId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  showTrigger = true,
}: AppointmentSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const shouldFetch = !!appointmentId && appointmentId.trim().length > 0;
  
  const { data: appointment, isLoading, refetch } = useAppointmentById(
    shouldFetch ? appointmentId : ""
  );

  const isViewMode = shouldFetch;
  const isCreateMode = !shouldFetch;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {showTrigger &&
        (trigger ? (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        ) : (
          <SheetTrigger asChild>
            <Button variant={variant} className={className}>
              <IconPlus className="size-4" />
              {text}
            </Button>
          </SheetTrigger>
        ))}
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Detalles de la cita</SheetTitle>
          <SheetDescription>La cita con todos sus detalles</SheetDescription>
        </SheetHeader>
        {!shouldFetch ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No se ha seleccionado ninguna cita
          </div>
        ) : isLoading && isViewMode ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Cargando detalles...
          </div>
        ) : isViewMode && appointment ? (
          <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="px-4 py-4 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-medium tracking-tighter">Estado</p>
                  <AppointmentsStatus
                    appointmentId={appointment.id}
                    currentStatus={appointment.status}
                    onSuccess={() => {
                      // Refetch appointment data to get the latest status
                      refetch();
                    }}
                  />
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="text-sm font-medium">
                      {appointment.status ? (
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getAppointmentStatusBadgeColor(appointment.status)}`}
                        >
                          {APPOINTMENT_STATUS_LABELS[appointment.status as keyof typeof APPOINTMENT_STATUS_LABELS] || appointment.status}
                        </Badge>
                      ) : (
                        "Sin estado"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xl font-medium tracking-tighter">Cliente</p>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium">
                      {appointment.customer?.name
                        ? `${appointment.customer.name} ${appointment.customer.lastName || ""}`
                        : appointment.customerName || "Sin nombre"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      {appointment.customer?.email || appointment.customerEmail}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">
                      {appointment.customer?.phoneNumber ||
                        appointment.customerPhone ||
                        "Sin teléfono"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xl font-medium tracking-tighter">Empleado</p>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Miembro</p>
                    <p className="text-sm font-medium">
                      {appointment.memberName || "Sin asignar"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="text-sm font-medium">
                      {appointment.memberRole || "Sin asignar"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      {appointment.memberEmail || "Sin asignar"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xl font-medium tracking-tighter">
                  Información de la cita
                </p>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="text-sm font-medium">
                      {safeFormatDate(appointment.appointmentDate, "d MMM yyyy")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="text-sm font-medium">
                      {appointment.startTime?.slice(0, 5)} - {appointment.endTime?.slice(0, 5)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xl font-medium tracking-tighter">
                  Servicios
                </p>
                <Separator />
                <div className="flex flex-col gap-2">
                  {appointment.servicesBooked &&
                  Array.isArray(appointment.servicesBooked) &&
                  appointment.servicesBooked.length > 0 ? (
                    <div className="space-y-4">
                      {(appointment.servicesBooked as ServiceBooked[])
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((service, index) => {
                          const price = parseFloat(service.servicePrice || "0");
                          const discount = service.serviceDiscount || 0;
                          const discountAmount = (price * discount) / 100;
                          const finalPrice = price - discountAmount;
                          const duration = service.serviceDuration || 0;
                          const hours = Math.floor(duration / 60);
                          const minutes = duration % 60;

                          let durationDisplay = "";
                          if (hours > 0 && minutes > 0) {
                            durationDisplay = `${hours}h ${minutes}m`;
                          } else if (hours > 0 && minutes === 0) {
                            durationDisplay = `${hours}h`;
                          } else if (hours === 0 && minutes > 0) {
                            durationDisplay = `${minutes}m`;
                          }

                          return (
                            <div
                              key={service.id || index}
                              className="space-y-1"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {service.serviceName}
                                  </p>
                                  <Badge className="text-xs">
                                    {durationDisplay
                                      ? durationDisplay
                                      : "Sin duración"}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  {discount > 0 && (
                                    <p className="text-xs text-muted-foreground line-through">
                                      $
                                      {price.toLocaleString("es-ES", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </p>
                                  )}
                                  <p className="font-semibold">
                                    $
                                    {finalPrice.toLocaleString("es-ES", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </p>
                                  {discount > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs mt-1"
                                    >
                                      -{discount}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No hay servicios registrados
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-medium tracking-tighter">Pago</p>
                  <AppointmentsPayment
                    appointmentId={appointment.id}
                    currentPaymentStatus={appointment.paymentStatus}
                    currentPaymentMethod={appointment.paymentMethod || undefined}
                    onSuccess={() => {
                      // Refetch appointment data to get the latest payment info
                      refetch();
                    }}
                  />
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Método de pago
                    </p>
                    <p className="text-sm font-medium">
                      {appointment.paymentMethod ? (
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getPaymentMethodBadgeColor(appointment.paymentMethod)}`}
                        >
                          {PAYMENT_METHOD_LABELS[appointment.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || appointment.paymentMethod}
                        </Badge>
                      ) : (
                        "Sin método"
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Estado de pago
                    </p>
                    <p className="text-sm font-medium">
                      {appointment.paymentStatus ? (
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getPaymentStatusBadgeColor(appointment.paymentStatus)}`}
                        >
                          {PAYMENT_STATUS_LABELS[appointment.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || appointment.paymentStatus}
                        </Badge>
                      ) : (
                        "Sin estado"
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-sm font-medium">
                      {appointment.amountPaid || "Sin total"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {appointment.notes && (
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Notas
                  </h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {appointment.notes}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between text-xs text-muted-foreground pt-4">
                <span>ID: {appointment.id}</span>
                <span>
                  Creado:{" "}
                  {safeFormatDate(appointment.createdAt, "d MMM yyyy HH:mm")}
                </span>
              </div>
            </div>
          </div>
        ) : isCreateMode ? (
          <div className="flex h-full flex-col p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>Nueva Cita</SheetTitle>
              <SheetDescription>
                Complete los datos para agendar una cita.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Formulario de creación en construcción
              </p>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
