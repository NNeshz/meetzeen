"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@meetzeen/ui/src/components/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCompany } from "@/modules/company/hooks/use-company";
import { toast } from "sonner";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const formSchema = z.object({
  startHour: z.number().min(0).max(23),
  startMinute: z.number().min(0).max(59),
});

export function CompanyHoraryOpen({
  startTime,
  onUpdate,
}: {
  startTime?: string;
  onUpdate: () => void;
}) {
  const { updateStartHour, isUpdatingStartHour } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Parse startTime from "HH:mm" format
  const parseTime = (time?: string) => {
    if (!time) return { hour: 9, minute: 0 };
    const [hour, minute] = time.split(":").map(Number);
    return { hour: hour || 9, minute: minute || 0 };
  };

  const initialTime = parseTime(startTime);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startHour: initialTime.hour,
      startMinute: initialTime.minute,
    },
  });

  useEffect(() => {
    const parsed = parseTime(startTime);
    form.reset({
      startHour: parsed.hour,
      startMinute: parsed.minute,
    });
    setMutationError(null);
  }, [startTime, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    // Formatear horas y minutos con dos dígitos
    const formattedHour = String(values.startHour).padStart(2, "0");
    const formattedMinute = String(values.startMinute).padStart(2, "0");
    
    updateStartHour(
      {
        startHour: Number(formattedHour),
        startMinute: Number(formattedMinute),
      },
      {
        onSuccess: () => {
          onUpdate();
          toast.success("Hora de apertura actualizada correctamente");
          form.reset({
            startHour: values.startHour,
            startMinute: values.startMinute,
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al actualizar la hora de apertura";
          setMutationError(errorMessage);
          toast.error("Error al actualizar la hora de apertura", {
            description: errorMessage,
          });
        },
      }
    );
  }

  const formErrors = form.formState.errors;
  const hasErrors =
    !!formErrors.startHour ||
    !!formErrors.startMinute ||
    !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Hora de apertura</p>
                <p className="text-sm text-muted-foreground">
                  Esta es la hora de apertura de tu empresa. Puedes cambiarla en
                  cualquier momento.
                </p>
              </div>
              <ButtonGroup className="w-full max-w-md">
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                          disabled={isUpdatingStartHour}
                        >
                          <SelectTrigger className="w-full" data-slot="select-trigger">
                            {field.value} h
                          </SelectTrigger>
                          <SelectContent>
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
                  name="startMinute"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                          disabled={isUpdatingStartHour}
                        >
                          <SelectTrigger className="w-full" data-slot="select-trigger">
                            {String(field.value).padStart(2, "0")} m
                          </SelectTrigger>
                          <SelectContent>
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
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Horario de atención para los clientes. Esto será público para todos los clientes.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.startHour && (
                    <p className="text-sm text-destructive">
                      {formErrors.startHour.message}
                    </p>
                  )}
                  {formErrors.startMinute && (
                    <p className="text-sm text-destructive">
                      {formErrors.startMinute.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingStartHour}>
              {isUpdatingStartHour ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
