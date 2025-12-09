"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/components/button";
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
  SelectValue,
} from "@meetzeen/ui/components/select";
import { Input } from "@meetzeen/ui/components/input";
import { Label } from "@meetzeen/ui/components/label";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconRepeat, IconCalendar, IconClock, IconPlus, IconTrash, IconX, IconCheck } from "@tabler/icons-react";
import { cn } from "@meetzeen/ui/src/lib/utils";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const repeatTypeSchema = z.enum(["once", "repeat", "default", "remove"]);

// Schema para un horario individual
const timeSlotSchema = z.object({
  startHour: z.number().min(0).max(23),
  startMinute: z.number().min(0).max(59),
  endHour: z.number().min(0).max(23),
  endMinute: z.number().min(0).max(59),
});

// Función helper para convertir horas y minutos a minutos totales
function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

// Función para verificar si dos horarios se superponen
function areTimeSlotsOverlapping(
  slot1: { startHour: number; startMinute: number; endHour: number; endMinute: number },
  slot2: { startHour: number; startMinute: number; endHour: number; endMinute: number }
): boolean {
  const start1 = toMinutes(slot1.startHour, slot1.startMinute);
  const end1 = toMinutes(slot1.endHour, slot1.endMinute);
  const start2 = toMinutes(slot2.startHour, slot2.startMinute);
  const end2 = toMinutes(slot2.endHour, slot2.endMinute);

  // Dos horarios se superponen si: start1 < end2 && start2 < end1
  // O más simple: no se superponen si end1 <= start2 || end2 <= start1
  return !(end1 <= start2 || end2 <= start1);
}

const formSchema = z.object({
  repeatType: repeatTypeSchema,
  repeatCount: z.number().min(1).max(52).optional(),
  timeSlots: z.array(timeSlotSchema).optional(),
})
.refine(
  (data) => {
    // Si es "remove", no se requieren timeSlots
    if (data.repeatType === "remove") {
      return true;
    }
    // Para otros tipos, se requiere al menos un horario
    return data.timeSlots && data.timeSlots.length > 0;
  },
  {
    message: "Debe tener al menos un horario",
    path: ["timeSlots"],
  }
)
.refine(
  (data) => {
    // Si es "remove" o no hay timeSlots, no validar superposiciones
    if (data.repeatType === "remove" || !data.timeSlots || data.timeSlots.length <= 1) {
      return true;
    }

    // Validar que no haya horarios superpuestos
    for (let i = 0; i < data.timeSlots.length; i++) {
      const slot1 = data.timeSlots[i];
      if (!slot1) continue;
      
      for (let j = i + 1; j < data.timeSlots.length; j++) {
        const slot2 = data.timeSlots[j];
        if (!slot2) continue;
        
        if (areTimeSlotsOverlapping(slot1, slot2)) {
          return false;
        }
      }
    }
    return true;
  },
  {
    message: "Los horarios no pueden superponerse. Por favor, ajusta los horarios para que no se solapen.",
    path: ["timeSlots"],
  }
);

type FormValues = z.infer<typeof formSchema>;

interface CalendarRepeatFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  dayOfWeek: number;
  existingSchedule?: {
    startTime: string;
    endTime: string;
  }[];
  onSubmit: (values: {
    repeatType: "once" | "repeat" | "default" | "remove";
    repeatCount?: number;
    timeSlots?: Array<{
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
    }>;
  }) => void;
}

export function CalendarRepeatForm({
  open,
  onOpenChange,
  selectedDate,
  dayOfWeek,
  existingSchedule,
  onSubmit: onSubmitProp,
}: CalendarRepeatFormProps) {
  // Parsear horario existente si hay
  const parseTime = (time?: string) => {
    if (!time) return { hour: 9, minute: 0 };
    const [hour, minute] = time.split(":").map(Number);
    return { hour: hour || 9, minute: minute || 0 };
  };

  // Inicializar con horarios existentes o uno por defecto
  const getDefaultTimeSlots = () => {
    if (existingSchedule && existingSchedule.length > 0) {
      return existingSchedule.map((schedule) => {
        const start = parseTime(schedule.startTime);
        const end = parseTime(schedule.endTime);
        return {
          startHour: start.hour,
          startMinute: start.minute,
          endHour: end.hour,
          endMinute: end.minute,
        };
      });
    }
    return [{ startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 }];
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repeatType: "once",
      repeatCount: 4,
      timeSlots: getDefaultTimeSlots(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeSlots",
  });

  const repeatType = form.watch("repeatType") as "once" | "repeat" | "default" | "remove";
  const repeatCount = form.watch("repeatCount") || 4;
  const timeSlots = form.watch("timeSlots");

  React.useEffect(() => {
    if (open) {
      form.reset({
        repeatType: "once",
        repeatCount: 4,
        timeSlots: getDefaultTimeSlots(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Validación en tiempo real de horarios superpuestos
  React.useEffect(() => {
    if (repeatType === "remove" || !timeSlots || timeSlots.length <= 1) {
      // Limpiar error si no hay horarios o solo hay uno
      form.clearErrors("timeSlots");
      return;
    }

    // Validar que cada horario tenga startTime < endTime
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (!slot) continue;
      
      const startMinutes = toMinutes(slot.startHour, slot.startMinute);
      const endMinutes = toMinutes(slot.endHour, slot.endMinute);

      if (startMinutes >= endMinutes) {
        form.setError(`timeSlots.${i}`, {
          type: "manual",
          message: "La hora de fin debe ser mayor que la hora de inicio",
        });
        return;
      }
    }

    // Validar que no haya horarios superpuestos
    for (let i = 0; i < timeSlots.length; i++) {
      const slot1 = timeSlots[i];
      if (!slot1) continue;
      
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slot2 = timeSlots[j];
        if (!slot2) continue;
        
        if (areTimeSlotsOverlapping(slot1, slot2)) {
          const start1 = `${slot1.startHour.toString().padStart(2, "0")}:${slot1.startMinute.toString().padStart(2, "0")}`;
          const end1 = `${slot1.endHour.toString().padStart(2, "0")}:${slot1.endMinute.toString().padStart(2, "0")}`;
          const start2 = `${slot2.startHour.toString().padStart(2, "0")}:${slot2.startMinute.toString().padStart(2, "0")}`;
          const end2 = `${slot2.endHour.toString().padStart(2, "0")}:${slot2.endMinute.toString().padStart(2, "0")}`;
          
          form.setError("timeSlots", {
            type: "manual",
            message: `Los horarios se superponen: ${start1}-${end1} y ${start2}-${end2}. Por favor, ajusta los horarios para que no se solapen.`,
          });
          return;
        }
      }
    }

    // Si no hay errores, limpiar cualquier error previo
    form.clearErrors("timeSlots");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots, repeatType]);

  const onSubmit = (values: FormValues) => {
    // Si es "remove", no validar horarios
    if (values.repeatType === "remove") {
      onSubmitProp({
        repeatType: "remove",
        timeSlots: undefined,
      });
      onOpenChange(false);
      return;
    }

    // Validar que cada horario tenga startTime < endTime
    if (values.timeSlots) {
      for (let i = 0; i < values.timeSlots.length; i++) {
        const slot = values.timeSlots[i];
        if (!slot) continue;
        
        const startTime = `${slot.startHour.toString().padStart(2, "0")}:${slot.startMinute.toString().padStart(2, "0")}`;
        const endTime = `${slot.endHour.toString().padStart(2, "0")}:${slot.endMinute.toString().padStart(2, "0")}`;

        if (startTime >= endTime) {
          form.setError(`timeSlots.${i}`, {
            type: "manual",
            message: "La hora de fin debe ser mayor que la hora de inicio",
          });
          return;
        }
      }

      // Validar que no haya horarios superpuestos
      for (let i = 0; i < values.timeSlots.length; i++) {
        const slot1 = values.timeSlots[i];
        if (!slot1) continue;
        
        for (let j = i + 1; j < values.timeSlots.length; j++) {
          const slot2 = values.timeSlots[j];
          if (!slot2) continue;
          
          if (areTimeSlotsOverlapping(slot1, slot2)) {
            const start1 = `${slot1.startHour.toString().padStart(2, "0")}:${slot1.startMinute.toString().padStart(2, "0")}`;
            const end1 = `${slot1.endHour.toString().padStart(2, "0")}:${slot1.endMinute.toString().padStart(2, "0")}`;
            const start2 = `${slot2.startHour.toString().padStart(2, "0")}:${slot2.startMinute.toString().padStart(2, "0")}`;
            const end2 = `${slot2.endHour.toString().padStart(2, "0")}:${slot2.endMinute.toString().padStart(2, "0")}`;
            
            form.setError("timeSlots", {
              type: "manual",
              message: `Los horarios se superponen: ${start1}-${end1} y ${start2}-${end2}. Por favor, ajusta los horarios para que no se solapen.`,
            });
            return;
          }
        }
      }
    }

    onSubmitProp(values);
    onOpenChange(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const getNextOccurrences = (count: number) => {
    const occurrences: Date[] = [];
    const current = new Date(selectedDate);

    for (let i = 0; i < count; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i * 7);
      occurrences.push(date);
    }

    return occurrences;
  };

  const occurrences = getNextOccurrences(repeatCount);

  const handleAddTimeSlot = () => {
    append({ startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 });
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconCalendar className="size-5" />
            {existingSchedule && existingSchedule.length > 0
              ? "Editar horario"
              : "Agregar horario"}
          </SheetTitle>
          <SheetDescription>{formatDate(selectedDate)}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4"
          >
            {/* Horarios */}
            {repeatType !== "remove" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <IconClock className="size-4" />
                  Horarios
                </Label>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <IconClock className="size-4" />
                          <span>Horario {index + 1}</span>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTimeSlot(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <IconTrash className="size-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Hora de inicio */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Hora de inicio
                          </Label>
                          <ButtonGroup className="w-full">
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.startHour`}
                              render={({ field: hourField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) =>
                                        hourField.onChange(Number(value))
                                      }
                                      value={String(hourField.value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue>{hourField.value} h</SelectValue>
                                      </SelectTrigger>
                                      <SelectContent className="z-100">
                                        {HOURS.map((h) => (
                                          <SelectItem key={h} value={String(h)}>
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
                              name={`timeSlots.${index}.startMinute`}
                              render={({ field: minuteField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) =>
                                        minuteField.onChange(Number(value))
                                      }
                                      value={String(minuteField.value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue>
                                          {String(minuteField.value).padStart(
                                            2,
                                            "0"
                                          )}{" "}
                                          m
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent className="z-100">
                                        {MINUTES.map((m) => (
                                          <SelectItem key={m} value={String(m)}>
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
                          <Label className="text-xs font-medium text-muted-foreground">
                            Hora de fin
                          </Label>
                          <ButtonGroup className="w-full">
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.endHour`}
                              render={({ field: hourField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) =>
                                        hourField.onChange(Number(value))
                                      }
                                      value={String(hourField.value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue>{hourField.value} h</SelectValue>
                                      </SelectTrigger>
                                      <SelectContent className="z-100">
                                        {HOURS.map((h) => (
                                          <SelectItem key={h} value={String(h)}>
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
                              name={`timeSlots.${index}.endMinute`}
                              render={({ field: minuteField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) =>
                                        minuteField.onChange(Number(value))
                                      }
                                      value={String(minuteField.value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue>
                                          {String(minuteField.value).padStart(
                                            2,
                                            "0"
                                          )}{" "}
                                          m
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent className="z-100">
                                        {MINUTES.map((m) => (
                                          <SelectItem key={m} value={String(m)}>
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
                        name={`timeSlots.${index}`}
                        render={() => (
                          <FormItem>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Botón para agregar otro horario */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTimeSlot}
                  className="w-full"
                >
                  <IconPlus className="size-4 mr-2" />
                  Agregar horario
                </Button>

                <FormField
                  control={form.control}
                  name="timeSlots"
                  render={() => <FormMessage />}
                />
              </div>
            </div>
            )}

            {/* Opciones de repetición */}
            <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <IconRepeat className="size-4" />
                  Repetición
                </Label>
                <FormField
                  control={form.control}
                  name="repeatType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {/* Solo este día */}
                          <div
                            className={cn(
                              "flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 transition-all cursor-pointer",
                              field.value === "once"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange("once");
                            }}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 transition-all",
                              field.value === "once"
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/50"
                            )}>
                              {field.value === "once" && (
                                <IconCheck className="size-3.5 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-sm">
                                Solo este día
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(selectedDate)}
                              </p>
                            </div>
                          </div>

                          {/* Repetir X veces */}
                          <div
                            className={cn(
                              "rounded-lg border-2 p-4 transition-all",
                              field.value === "repeat"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                            )}
                          >
                            <div 
                              className="flex items-start space-x-3 space-y-0 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("repeat");
                              }}
                            >
                              <div className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 transition-all",
                                field.value === "repeat"
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/50"
                              )}>
                                {field.value === "repeat" && (
                                  <IconCheck className="size-3.5 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  Repetir los siguientes {DAY_NAMES[dayOfWeek]}s
                                </div>
                              </div>
                            </div>

                            {/* Input que aparece cuando se selecciona "repeat" */}
                            {repeatType === "repeat" && (
                              <div
                                className="mt-4 space-y-3 pl-7"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    ¿Cuántas veces se repetirá?
                                  </Label>
                                  <FormField
                                    control={form.control}
                                    name="repeatCount"
                                    render={({ field: countField }) => (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min={1}
                                          max={52}
                                          className={cn(
                                            "w-24 h-10 text-sm text-center font-medium",
                                            "focus:ring-2 focus:ring-primary focus:border-primary",
                                            "hover:border-primary/50",
                                            "border-primary bg-background"
                                          )}
                                          value={countField.value || 4}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            const value = Number(e.target.value);
                                            if (value >= 1 && value <= 52) {
                                              countField.onChange(value);
                                            } else if (e.target.value === "") {
                                              countField.onChange(0);
                                            }
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          onFocus={(e) => e.stopPropagation()}
                                          placeholder="4"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                          veces
                                        </span>
                                      </div>
                                    )}
                                  />
                                </div>

                                {/* Fechas de repetición */}
                                <div className="space-y-1.5 pt-1">
                                  <p className="text-xs text-muted-foreground font-medium">
                                    Fechas de repetición:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {occurrences.map((date, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                      >
                                        {formatShortDate(date)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Nuevo horario por defecto */}
                          <div
                            className={cn(
                              "flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 transition-all cursor-pointer",
                              field.value === "default"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange("default");
                            }}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 transition-all",
                              field.value === "default"
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/50"
                            )}>
                              {field.value === "default" && (
                                <IconCheck className="size-3.5 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-sm">
                                Nuevo horario por defecto para todos los{" "}
                                {DAY_NAMES[dayOfWeek]}s
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Este será el horario base para todos los{" "}
                                {DAY_NAMES[dayOfWeek]}s futuros
                              </p>
                            </div>
                          </div>

                          {/* Eliminar horario - Solo visible si hay horario existente */}
                          {existingSchedule && existingSchedule.length > 0 && (
                            <div
                              className={cn(
                                "flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 transition-all cursor-pointer",
                                field.value === "remove"
                                  ? "border-destructive bg-destructive/5"
                                  : "border-border hover:border-destructive/50 hover:bg-destructive/5"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("remove");
                              }}
                            >
                              <div className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 transition-all",
                                field.value === "remove"
                                  ? "border-destructive bg-destructive"
                                  : "border-muted-foreground/50"
                              )}>
                                {field.value === "remove" && (
                                  <IconCheck className="size-3.5 text-destructive-foreground" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="font-medium text-sm text-destructive flex items-center gap-2">
                                  <IconX className="size-4" />
                                  No trabajar este día
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Eliminar el horario para este día y marcar como no disponible
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <SheetFooter className="gap-2 px-0 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                variant={repeatType === "remove" ? "destructive" : "default"}
              >
                {repeatType === "remove" ? "Eliminar horario" : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
