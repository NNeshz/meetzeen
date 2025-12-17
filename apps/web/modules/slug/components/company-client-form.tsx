"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { ladaCodes } from "@/modules/slug/constants/lada-codes";
import { useCompanyServicesStore } from "@/modules/slug/store/service-store";
import { useEmployeeSelectionStore } from "@/modules/slug/store/employee-store";
import { IconClock, IconUser, IconCalendar } from "@tabler/icons-react";
import { Card } from "@meetzeen/ui/components/card";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .regex(/^[^\s]+$/, { message: "Solo se permite un nombre, sin espacios" }),
  lastName: z
    .string()
    .min(1, { message: "El apellido es requerido" })
    .regex(/^[^\s]+$/, {
      message: "Solo se permite un apellido, sin espacios",
    }),
  email: z
    .string()
    .email({ message: "El correo debe ser un email válido" })
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
      message: "Esto es obligatorio y debe ser correo de gmail por favor",
    }),
  ladaCode: z.string().max(3, { message: "Máximo 3 caracteres" }).optional(),
  phone: z.string().max(10, { message: "Máximo 10 caracteres" }).optional(),
});

function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

function calculateFinalPrice(price: number, discount: number): number {
  if (discount && discount > 0) {
    return price * (1 - discount / 100);
  }
  return price;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CompanyClientForm() {
  const { services } = useCompanyServicesStore();
  const { selectedDate, selectedEmployeeName, selectedTimeSlot } =
    useEmployeeSelectionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      ladaCode: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-0 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Información del cliente</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus datos para terminar.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Apellido <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Perez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                  <span className="text-xs text-destructive">
                    (Gmail obligatorio) *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="juan.perez@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>
              Teléfono{" "}
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </FormLabel>
            <ButtonGroup className="w-full">
              <FormField
                control={form.control}
                name="ladaCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          // Extraer el código numérico del value (formato: "code-index")
                          const codeValue = value.split("-")[0];
                          field.onChange(codeValue);
                        }}
                        value={
                          field.value
                            ? `${field.value}-${ladaCodes.findIndex(
                                (code) => code.value === field.value
                              )}`
                            : ""
                        }
                      >
                        <SelectTrigger
                          className="w-[120px] min-w-[120px]"
                          data-slot="select-trigger"
                        >
                          {field.value
                            ? ladaCodes.find(
                                (code) => code.value === field.value
                              )?.label || "Seleccionar"
                            : "Código"}
                        </SelectTrigger>
                        <SelectContent>
                          {ladaCodes.map((code, index) => (
                            <SelectItem
                              key={`lada-${index}`}
                              value={`${code.value}-${index}`}
                            >
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="222 333 4444"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ButtonGroup>
          </div>
        </form>
      </Form>

      {/* Resumen de la reserva */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Resumen de tu reserva</h2>

        {/* Lista de servicios */}
        {services.length > 0 && (
          <div className="space-y-3 mb-6">
            {services.map((service) => {
              const finalPrice = calculateFinalPrice(
                service.price,
                service.discount
              );

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <IconClock className="h-3 w-3" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {service.discount > 0 ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-semibold">
                          ${formatPrice(finalPrice)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${formatPrice(service.price)}
                        </span>
                        <span className="text-xs text-green-600">
                          -{service.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        ${formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Información de cita */}
        {(selectedDate || selectedEmployeeName || selectedTimeSlot) && (
          <div className="space-y-3 pt-4 border-t mb-6">
            <h3 className="font-semibold text-sm mb-3">
              Información de la cita
            </h3>

            {selectedEmployeeName && (
              <div className="flex items-center gap-2 text-sm">
                <IconUser className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Atendido por:</span>
                <span className="font-medium">{selectedEmployeeName}</span>
              </div>
            )}

            {selectedDate && (
              <div className="flex items-center gap-2 text-sm">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium capitalize">
                  {formatDate(selectedDate)}
                </span>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="flex items-center gap-2 text-sm">
                <IconClock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Horario:</span>
                <span className="font-medium">{selectedTimeSlot}</span>
              </div>
            )}
          </div>
        )}

        {/* Totales */}
        {services.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            {(() => {
              const totalOriginalPrice = services.reduce(
                (sum, service) => sum + service.price,
                0
              );

              const totalFinalPrice = services.reduce(
                (sum, service) =>
                  sum + calculateFinalPrice(service.price, service.discount),
                0
              );

              const totalDiscount = totalOriginalPrice - totalFinalPrice;
              const totalDiscountPercentage =
                totalOriginalPrice > 0
                  ? ((totalDiscount / totalOriginalPrice) * 100).toFixed(1)
                  : 0;

              const totalDuration = services.reduce(
                (sum, service) => sum + service.duration,
                0
              );

              return (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="line-through text-muted-foreground">
                      ${formatPrice(totalOriginalPrice)}
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Descuento:</span>
                      <span className="text-green-600 font-semibold">
                        -${formatPrice(totalDiscount)} (
                        {totalDiscountPercentage}%)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${formatPrice(totalFinalPrice)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconClock className="h-4 w-4" />
                      <span>Tiempo total:</span>
                    </div>
                    <span className="font-semibold">
                      {formatDuration(totalDuration)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {services.length === 0 &&
          !selectedDate &&
          !selectedEmployeeName &&
          !selectedTimeSlot && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Completa los pasos anteriores para ver el resumen de tu reserva
            </p>
          )}
      </Card>
    </div>
  );
}
