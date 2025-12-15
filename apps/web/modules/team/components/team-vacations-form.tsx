"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@meetzeen/ui/components/form";
import { Button } from "@meetzeen/ui/components/button";
import { Textarea } from "@meetzeen/ui/components/textarea";
import { Calendar } from "@meetzeen/ui/components/calendar";
import { IconBeach, IconCalendarOff } from "@tabler/icons-react";
import { useSetDaysOff } from "@/modules/team/hooks/use-team";
import { DateRange } from "react-day-picker";

const vacationsSchema = z.object({
  dateRange: z.object({
    from: z.date({ error: "Selecciona la fecha de inicio" }),
    to: z.date({ error: "Selecciona la fecha de fin" }).optional(),
  }).refine((data) => {
    if (data.to && data.from) {
      return data.to >= data.from;
    }
    return true;
  }, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
  }),
  reason: z.string().optional(),
});

interface TeamVacationsFormProps {
  memberId: string;
  onSuccess?: () => void;
}

export function TeamVacationsForm({ memberId, onSuccess }: TeamVacationsFormProps) {
  const [open, setOpen] = useState(false);
  const { setDaysOff, isSettingDaysOff } = useSetDaysOff();

  const form = useForm<z.infer<typeof vacationsSchema>>({
    resolver: zodResolver(vacationsSchema),
    defaultValues: {
      dateRange: undefined,
      reason: "",
    },
  });

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToSpanish = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onSubmit = (values: z.infer<typeof vacationsSchema>) => {
    const startDate = values.dateRange.from;
    const endDate = values.dateRange.to || startDate;

    if (!startDate) {
      toast.error("Debes seleccionar al menos una fecha");
      return;
    }

    setDaysOff(
      {
        memberId,
        startDate: formatDateToString(startDate),
        endDate: formatDateToString(endDate),
        reason: values.reason,
      },
      {
        onSuccess: () => {
          const dayCount =
            Math.ceil(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;
          toast.success(
            `Días libres configurados correctamente (${dayCount} día${
              dayCount > 1 ? "s" : ""
            })`
          );
          setOpen(false);
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Error al configurar los días libres", {
            description: error.message,
          });
        },
      }
    );
  };

  const selectedRange = form.watch("dateRange");
  const dayCount =
    selectedRange?.from && selectedRange?.to
      ? Math.ceil(
          (selectedRange.to.getTime() - selectedRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : selectedRange?.from
      ? 1
      : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center">
          <IconBeach className="size-4 mr-2" />
          Días libres / Vacaciones
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Configurar días libres</SheetTitle>
          <SheetDescription>
            Marca periodos de vacaciones o días libres para el miembro del equipo
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Periodo de días libres</FormLabel>
                    <FormDescription>
                      Selecciona un día o un rango de fechas
                    </FormDescription>
                    <Calendar
                      mode="range"
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      className="border rounded-md"
                      numberOfMonths={1}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                    {selectedRange?.from && (
                      <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Fecha de inicio:
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {formatDateToSpanish(selectedRange.from)}
                          </span>
                        </div>
                        {selectedRange.to && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                Fecha de fin:
                              </span>
                              <span className="text-sm font-medium capitalize">
                                {formatDateToSpanish(selectedRange.to)}
                              </span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Total de días:
                                </span>
                                <span className="text-sm font-bold">
                                  {dayCount} día{dayCount > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Razón <span className="text-xs text-muted-foreground">(Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Vacaciones anuales, Permiso médico, etc."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Puedes agregar una nota sobre estos días libres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                <div className="flex items-start gap-3">
                  <IconCalendarOff className="size-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Los horarios de estos días serán marcados como no disponibles
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Durante este periodo, el miembro no podrá recibir citas ni
                      reservaciones. Los días libres se aplicarán automáticamente y
                      sobrescribirán cualquier horario existente.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSettingDaysOff || !selectedRange?.from}
                className="w-full"
              >
                {isSettingDaysOff ? "Guardando..." : "Guardar días libres"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
