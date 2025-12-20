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
import {
  IconPlus,
  IconCalendar,
  IconClock,
  IconMail,
  IconPhone,
  IconNotes,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAppointmentById } from "@/modules/appointments/hooks/use-appointments";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@meetzeen/ui/components/avatar";

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

  const { data: appointment, isLoading } = useAppointmentById(
    appointmentId || ""
  );

  const isViewMode = !!appointmentId;
  const isCreateMode = !appointmentId;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {showTrigger && (
        trigger ? (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        ) : (
          <SheetTrigger asChild>
            <Button variant={variant} className={className}>
              <IconPlus className="size-4" />
              {text}
            </Button>
          </SheetTrigger>
        )
      )}
      <SheetContent className="w-full sm:max-w-xl font-geist p-0 gap-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Cita</SheetTitle>
          <SheetDescription>Detalles de la cita</SheetDescription>
        </SheetHeader>
        {isLoading && isViewMode ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Cargando detalles...
          </div>
        ) : isViewMode && appointment ? (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="px-8 py-8 space-y-8">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">
                    Cita
                  </h1>
                  {appointment.status && (
                    <Badge
                      variant={
                        appointment.status === "cancelled" ||
                        appointment.status === "no_show"
                          ? "destructive"
                          : appointment.status === "completed"
                            ? "secondary"
                            : "default"
                      }
                      className="capitalize"
                    >
                      {appointment.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="size-4" />
                    <span>
                      {format(
                        new Date(
                          `${(appointment.appointmentDate || "").replace("Date:", "")}T${appointment.startTime}`
                        ),
                        "EEEE, d 'de' MMMM yyyy",
                        { locale: es }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconClock className="size-4" />
                    <span>
                      {appointment.startTime?.slice(0, 5)} -{" "}
                      {appointment.endTime?.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cliente
                </h2>
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(
                        appointment.customer?.name
                          ? `${appointment.customer.name} ${appointment.customer.lastName || ""}`
                          : appointment.customerName || "?"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">
                      {appointment.customer?.name
                        ? `${appointment.customer.name} ${appointment.customer.lastName || ""}`
                        : appointment.customerName || "Sin nombre"}
                    </p>
                    {(appointment.customer?.email ||
                      appointment.customerEmail) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconMail className="size-3.5" />
                        <span>
                          {appointment.customer?.email ||
                            appointment.customerEmail}
                        </span>
                      </div>
                    )}
                    {(appointment.customer?.phoneNumber ||
                      appointment.customerPhone) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconPhone className="size-3.5" />
                        <span>
                          {appointment.customer?.phoneNumber ||
                            appointment.customerPhone}
                        </span>
                      </div>
                    )}
                    {(appointment.customer?.notes ||
                      appointment.customerNotes) && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                        <IconNotes className="size-3.5 mt-0.5" />
                        <span className="italic">
                          {appointment.customer?.notes ||
                            appointment.customerNotes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profesional */}
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profesional
                </h2>
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {getInitials(appointment.memberName || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {appointment.memberName || "Sin asignar"}
                    </p>
                    {appointment.memberEmail && (
                      <p className="text-sm text-muted-foreground">
                        {appointment.memberEmail}
                      </p>
                    )}
                    {appointment.memberRole && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {appointment.memberRole}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Servicios
                </h2>

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
                          <div key={service.id || index} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">
                                  {service.serviceName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {durationDisplay}
                                </p>
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

                    {/* Total */}
                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>
                          $
                          {(appointment.servicesBooked as ServiceBooked[])
                            .reduce(
                              (total, service) =>
                                total + parseFloat(service.servicePrice || "0"),
                              0
                            )
                            .toLocaleString("es-ES", {
                              minimumFractionDigits: 2,
                            })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Descuento</span>
                        <span>
                          -$
                          {(appointment.servicesBooked as ServiceBooked[])
                            .reduce((total, service) => {
                              const price = parseFloat(
                                service.servicePrice || "0"
                              );
                              const discount = service.serviceDiscount || 0;
                              return total + (price * discount) / 100;
                            }, 0)
                            .toLocaleString("es-ES", {
                              minimumFractionDigits: 2,
                            })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl">
                          $
                          {(appointment.servicesBooked as ServiceBooked[])
                            .reduce((total, service) => {
                              const price = parseFloat(
                                service.serviceTotal ||
                                  service.servicePrice ||
                                  "0"
                              );
                              return total + price;
                            }, 0)
                            .toLocaleString("es-ES", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay servicios registrados
                  </p>
                )}
              </div>

              {/* Pago */}
              <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pago
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    {appointment.paymentMethod ? (
                      <p className="capitalize font-medium">
                        {appointment.paymentMethod.replace("_", " ")}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">No especificado</p>
                    )}
                    {appointment.amountPaid &&
                      appointment.paymentStatus !== "pending" && (
                        <p className="text-sm text-muted-foreground">
                          Abonado: $
                          {parseFloat(appointment.amountPaid).toLocaleString(
                            "es-ES",
                            { minimumFractionDigits: 2 }
                          )}
                        </p>
                      )}
                  </div>
                  {appointment.paymentStatus && (
                    <Badge
                      variant={
                        appointment.paymentStatus === "paid"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {appointment.paymentStatus === "paid"
                        ? "Pagado"
                        : appointment.paymentStatus === "pending"
                          ? "Pendiente"
                          : appointment.paymentStatus}
                    </Badge>
                  )}
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

              {/* Cancelación */}
              {appointment.cancellationReason && (
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-destructive uppercase tracking-wider">
                    Motivo de Cancelación
                  </h2>
                  <p className="text-sm text-destructive/90">
                    {appointment.cancellationReason}
                  </p>
                  {appointment.cancelledBy && (
                    <p className="text-xs text-muted-foreground">
                      Cancelado por:{" "}
                      <span className="capitalize">
                        {appointment.cancelledBy}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between text-xs text-muted-foreground pt-4">
                <span>ID: {appointment.id}</span>
                <span>
                  Creado:{" "}
                  {format(new Date(appointment.createdAt), "d MMM yyyy HH:mm", {
                    locale: es,
                  })}
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
