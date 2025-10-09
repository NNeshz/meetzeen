"use client";

import type React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  IconMapPin,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";

import { Button } from "@meetzeen/ui/components/button";
import { ButtonGroup } from "@meetzeen/ui/components/button-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/components/form";
import { Input } from "@meetzeen/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";
import { Checkbox } from "@meetzeen/ui/components/checkbox";
import { toast } from "sonner";

// Días de la semana
const WORK_DAYS = [
  { id: "monday", label: "Lunes", value: "Lunes" },
  { id: "tuesday", label: "Martes", value: "Martes" },
  { id: "wednesday", label: "Miércoles", value: "Miércoles" },
  { id: "thursday", label: "Jueves", value: "Jueves" },
  { id: "friday", label: "Viernes", value: "Viernes" },
  { id: "saturday", label: "Sábado", value: "Sábado" },
  { id: "sunday", label: "Domingo", value: "Domingo" },
] as const;

// Horas (1-12)
const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return { value: hour.toString().padStart(2, "0"), label: hour.toString() };
});

// Minutos (00, 15, 30, 45)
const MINUTES = [
  { value: "00", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

// AM/PM
const AM_PM = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

const contactInfoSchema = z.object({
  address: z
    .string()
    .url("Debe ser una URL válida de Google Maps")
    .optional()
    .or(z.literal("")),
  workDays: z
    .array(z.string())
    .min(1, "Selecciona al menos un día de trabajo"),
  startHour: z.string().min(1, "Selecciona la hora de inicio"),
  startMinute: z.string().min(1, "Selecciona los minutos de inicio"),
  startAmPm: z.string().min(1, "Selecciona AM o PM para la hora de inicio"),
  endHour: z.string().min(1, "Selecciona la hora de cierre"),
  endMinute: z.string().min(1, "Selecciona los minutos de cierre"),
  endAmPm: z.string().min(1, "Selecciona AM o PM para la hora de cierre"),
}).refine((data) => {
  // Validar que la hora de cierre sea después de la hora de inicio
  const startTime = new Date();
  const endTime = new Date();
  
  let startHour = parseInt(data.startHour);
  let endHour = parseInt(data.endHour);
  
  // Convertir a formato 24 horas
  if (data.startAmPm === "PM" && startHour !== 12) startHour += 12;
  if (data.startAmPm === "AM" && startHour === 12) startHour = 0;
  if (data.endAmPm === "PM" && endHour !== 12) endHour += 12;
  if (data.endAmPm === "AM" && endHour === 12) endHour = 0;
  
  startTime.setHours(startHour, parseInt(data.startMinute), 0, 0);
  endTime.setHours(endHour, parseInt(data.endMinute), 0, 0);
  
  return endTime > startTime;
}, {
  message: "La hora de cierre debe ser posterior a la hora de inicio",
  path: ["endHour"],
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoFormProps {
  onSubmit?: (values: ContactInfoFormValues) => void;
  initialData?: Partial<ContactInfoFormValues>;
}

export function ContactInfoForm({ onSubmit, initialData }: ContactInfoFormProps) {
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      address: "",
      workDays: [],
      startHour: "09",
      startMinute: "00",
      startAmPm: "AM",
      endHour: "06",
      endMinute: "00",
      endAmPm: "PM",
      ...initialData,
    },
  });

  async function handleSubmit(values: ContactInfoFormValues) {
    try {
      const data = {
        ...values,
        address: values.address?.trim() || null,
      };

      toast.success("Información de contacto guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la información de contacto");
    }
  }

  function handleWorkDayChange(dayValue: string, checked: boolean) {
    const currentWorkDays = form.getValues("workDays");
    if (checked) {
      form.setValue("workDays", [...currentWorkDays, dayValue]);
    } else {
      form.setValue("workDays", currentWorkDays.filter(day => day !== dayValue));
    }
  }

  const watchWorkDays = form.watch("workDays");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Información de contacto
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura la dirección y horarios de atención de tu empresa
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Dirección */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconMapPin className="w-4 h-4" />
                  Dirección (Google Maps)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://maps.google.com/..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Pega aquí la URL de Google Maps de tu ubicación (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Días de trabajo */}
          <FormField
            control={form.control}
            name="workDays"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <IconCalendar className="w-4 h-4" />
                  Días de trabajo *
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {WORK_DAYS.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={watchWorkDays.includes(day.value)}
                          onCheckedChange={(checked) =>
                            handleWorkDayChange(day.value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={day.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Selecciona los días en que tu empresa está abierta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Horarios */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconClock className="w-4 h-4" />
              <h3 className="text-sm font-medium">Horarios de atención *</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hora de inicio */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Hora de apertura
                </h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Hora : Minutos : AM/PM
                  </div>
                  <ButtonGroup>
                    <FormField
                      control={form.control}
                      name="startHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem key={hour.value} value={hour.value}>
                                    {hour.label}
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
                      name="startMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {MINUTES.map((minute) => (
                                  <SelectItem key={minute.value} value={minute.value}>
                                    {minute.label}
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
                      name="startAmPm"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                              <SelectContent>
                                {AM_PM.map((period) => (
                                  <SelectItem key={period.value} value={period.value}>
                                    {period.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </ButtonGroup>
                  {(form.formState.errors.startHour || 
                    form.formState.errors.startMinute || 
                    form.formState.errors.startAmPm) && (
                    <FormMessage>
                      {form.formState.errors.startHour?.message ||
                       form.formState.errors.startMinute?.message ||
                       form.formState.errors.startAmPm?.message}
                    </FormMessage>
                  )}
                </div>
              </div>

              {/* Hora de cierre */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Hora de cierre
                </h4>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Hora : Minutos : AM/PM
                  </div>
                  <ButtonGroup>
                    <FormField
                      control={form.control}
                      name="endHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem key={hour.value} value={hour.value}>
                                    {hour.label}
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
                      name="endMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {MINUTES.map((minute) => (
                                  <SelectItem key={minute.value} value={minute.value}>
                                    {minute.label}
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
                      name="endAmPm"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                              <SelectContent>
                                {AM_PM.map((period) => (
                                  <SelectItem key={period.value} value={period.value}>
                                    {period.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </ButtonGroup>
                  {(form.formState.errors.endHour || 
                    form.formState.errors.endMinute || 
                    form.formState.errors.endAmPm) && (
                    <FormMessage>
                      {form.formState.errors.endHour?.message ||
                       form.formState.errors.endMinute?.message ||
                       form.formState.errors.endAmPm?.message}
                    </FormMessage>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-start">
            <Button type="submit" className="w-full md:w-auto md:min-w-48">
              Guardar información de contacto
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}