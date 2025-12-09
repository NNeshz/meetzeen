"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
import { IconPlus, IconTrash, IconClock } from "@tabler/icons-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@meetzeen/ui/components/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/components/select";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { Checkbox } from "@meetzeen/ui/components/checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateMemberCalendar } from "@/modules/team/hooks/use-team";
import { toast } from "sonner";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { UpdateMemberCalendar } from "@/modules/team/types/team.types";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

// Schema para un horario individual
const timeSlotSchema = z.object({
  startHour: z.number().min(0).max(23),
  startMinute: z.number().min(0).max(59),
  endHour: z.number().min(0).max(23),
  endMinute: z.number().min(0).max(59),
});

// Schema para un día con sus horarios
const dayScheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  selected: z.boolean(),
  timeSlots: z.array(timeSlotSchema).min(1, "Debe tener al menos un horario"),
});

// Schema completo del formulario
const formSchema = z.object({
  days: z.array(dayScheduleSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamCalendarCreateProps {
  userId: string;
  trigger?: React.ReactNode;
}

export function TeamCalendarCreate({
  userId,
  trigger,
}: TeamCalendarCreateProps) {
  const [open, setOpen] = React.useState(false);
  const organizationId = useDashboardStore((state) => state.organization?.id);
  const { mutate: updateCalendar, isPending } = useUpdateMemberCalendar(userId);

  // Inicializar con todos los días deseleccionados
  const defaultValues: FormValues = {
    days: Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      selected: false,
      timeSlots: [{ startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 }],
    })),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "days",
  });

  // Resetear formulario cuando se abre el sheet
  React.useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDayToggle = (dayIndex: number, checked: boolean) => {
    const currentDays = form.getValues("days");
    if (!currentDays || !currentDays[dayIndex]) return;

    const day = currentDays[dayIndex];
    day.selected = checked;

    // Si se deselecciona, limpiar los horarios
    if (!checked) {
      day.timeSlots = [
        { startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 },
      ];
    }

    form.setValue("days", currentDays);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const currentDays = form.getValues("days");
    if (!currentDays || !currentDays[dayIndex]) return;

    const day = currentDays[dayIndex];
    day.timeSlots.push({
      startHour: 9,
      startMinute: 0,
      endHour: 18,
      endMinute: 0,
    });
    form.setValue("days", currentDays);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const currentDays = form.getValues("days");
    if (!currentDays || !currentDays[dayIndex]) return;

    const day = currentDays[dayIndex];
    if (day.timeSlots.length > 1) {
      day.timeSlots.splice(slotIndex, 1);
      form.setValue("days", currentDays);
    }
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  const onSubmit = (values: FormValues) => {
    if (!organizationId) {
      toast.error("Error", {
        description: "Organization ID is required",
      });
      return;
    }

    // Filtrar solo los días seleccionados y convertir a formato UpdateMemberCalendar
    const schedules: UpdateMemberCalendar[] = [];

    values.days.forEach((day) => {
      if (day.selected && day.timeSlots.length > 0) {
        day.timeSlots.forEach((slot) => {
          const startTime = formatTime(slot.startHour, slot.startMinute);
          const endTime = formatTime(slot.endHour, slot.endMinute);

          // Validar que startTime < endTime
          if (startTime >= endTime) {
            toast.error("Error de validación", {
              description: `El horario de inicio debe ser menor que el de fin para ${DAY_NAMES[day.dayOfWeek]}`,
            });
            return;
          }

          schedules.push({
            dayOfWeek: day.dayOfWeek,
            startTime,
            endTime,
          });
        });
      }
    });

    if (schedules.length === 0) {
      toast.error("Error", {
        description: "Debes seleccionar al menos un día con horarios",
      });
      return;
    }

    updateCalendar(
      {
        userId,
        organizationId,
        schedules,
      },
      {
        onSuccess: () => {
          toast.success("Horarios actualizados correctamente");
          setOpen(false);
          form.reset(defaultValues);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al actualizar los horarios";
          toast.error("Error", {
            description: errorMessage,
          });
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <IconPlus className="size-4 mr-2" />
            Crear horario
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl font-geist overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Gestionar horarios</SheetTitle>
          <SheetDescription>
            Selecciona los días de la semana y configura los horarios de
            disponibilidad
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {fields.map((field, dayIndex) => {
              const day = form.watch(`days.${dayIndex}`);
              const timeSlots = form.watch(`days.${dayIndex}.timeSlots`);

              return (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  {/* Checkbox para seleccionar el día */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FormField
                        control={form.control}
                        name={`days.${dayIndex}.selected`}
                        render={({ field: checkboxField }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={checkboxField.value}
                                onCheckedChange={(checked) => {
                                  checkboxField.onChange(checked);
                                  handleDayToggle(dayIndex, checked as boolean);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <label className="text-sm font-medium cursor-pointer">
                                {DAY_NAMES[day.dayOfWeek]}
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Horarios del día */}
                  {day.selected && (
                    <div className="space-y-4 pl-7">
                      {timeSlots.map((_, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="border rounded-md p-4 space-y-4 bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <IconClock className="size-4" />
                              <span>Horario {slotIndex + 1}</span>
                            </div>
                            {timeSlots.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveTimeSlot(dayIndex, slotIndex)
                                }
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <IconTrash className="size-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Hora de inicio */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">
                                Hora de inicio
                              </label>
                              <ButtonGroup className="w-full">
                                <FormField
                                  control={form.control}
                                  name={`days.${dayIndex}.timeSlots.${slotIndex}.startHour`}
                                  render={({ field: hourField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          onValueChange={(value) =>
                                            hourField.onChange(Number(value))
                                          }
                                          value={String(hourField.value)}
                                          disabled={isPending}
                                        >
                                          <SelectTrigger className="w-full">
                                            {hourField.value} h
                                          </SelectTrigger>
                                          <SelectContent>
                                            {HOURS.map((h) => (
                                              <SelectItem
                                                key={h}
                                                value={String(h)}
                                              >
                                                {h} h
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`days.${dayIndex}.timeSlots.${slotIndex}.startMinute`}
                                  render={({ field: minuteField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          onValueChange={(value) =>
                                            minuteField.onChange(Number(value))
                                          }
                                          value={String(minuteField.value)}
                                          disabled={isPending}
                                        >
                                          <SelectTrigger className="w-full">
                                            {String(minuteField.value).padStart(
                                              2,
                                              "0"
                                            )}{" "}
                                            m
                                          </SelectTrigger>
                                          <SelectContent>
                                            {MINUTES.map((m) => (
                                              <SelectItem
                                                key={m}
                                                value={String(m)}
                                              >
                                                {String(m).padStart(2, "0")} m
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </ButtonGroup>
                            </div>

                            {/* Hora de fin */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">
                                Hora de fin
                              </label>
                              <ButtonGroup className="w-full">
                                <FormField
                                  control={form.control}
                                  name={`days.${dayIndex}.timeSlots.${slotIndex}.endHour`}
                                  render={({ field: hourField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          onValueChange={(value) =>
                                            hourField.onChange(Number(value))
                                          }
                                          value={String(hourField.value)}
                                          disabled={isPending}
                                        >
                                          <SelectTrigger className="w-full">
                                            {hourField.value} h
                                          </SelectTrigger>
                                          <SelectContent>
                                            {HOURS.map((h) => (
                                              <SelectItem
                                                key={h}
                                                value={String(h)}
                                              >
                                                {h} h
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`days.${dayIndex}.timeSlots.${slotIndex}.endMinute`}
                                  render={({ field: minuteField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          onValueChange={(value) =>
                                            minuteField.onChange(Number(value))
                                          }
                                          value={String(minuteField.value)}
                                          disabled={isPending}
                                        >
                                          <SelectTrigger className="w-full">
                                            {String(minuteField.value).padStart(
                                              2,
                                              "0"
                                            )}{" "}
                                            m
                                          </SelectTrigger>
                                          <SelectContent>
                                            {MINUTES.map((m) => (
                                              <SelectItem
                                                key={m}
                                                value={String(m)}
                                              >
                                                {String(m).padStart(2, "0")} m
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </ButtonGroup>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name={`days.${dayIndex}.timeSlots.${slotIndex}`}
                            render={() => (
                              <FormItem>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}

                      {/* Botón para agregar otro horario */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTimeSlot(dayIndex)}
                        className="w-full"
                        disabled={isPending}
                      >
                        <IconPlus className="size-4 mr-2" />
                        Agregar horario
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar horarios"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
