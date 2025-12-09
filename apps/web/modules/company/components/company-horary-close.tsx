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
  endHour: z.number().min(0).max(23),
  endMinute: z.number().min(0).max(59),
});

export function CompanyHoraryClose({
  endTime,
  onUpdate,
}: {
  endTime?: string;
  onUpdate: () => void;
}) {
  const { updateEndHour, isUpdatingEndHour } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Parse endTime from "HH:mm" format
  const parseTime = (time?: string) => {
    if (!time) return { hour: 18, minute: 0 };
    const [hour, minute] = time.split(":").map(Number);
    return { hour: hour || 18, minute: minute || 0 };
  };

  const initialTime = parseTime(endTime);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endHour: initialTime.hour,
      endMinute: initialTime.minute,
    },
  });

  useEffect(() => {
    const parsed = parseTime(endTime);
    form.reset({
      endHour: parsed.hour,
      endMinute: parsed.minute,
    });
    setMutationError(null);
  }, [endTime, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    // Formatear horas y minutos con dos dígitos
    const formattedHour = String(values.endHour).padStart(2, "0");
    const formattedMinute = String(values.endMinute).padStart(2, "0");
    
    updateEndHour(
      {
        endHour: Number(formattedHour),
        endMinute: Number(formattedMinute),
      },
      {
        onSuccess: () => {
          onUpdate();
          toast.success("Hora de cierre actualizada correctamente");
          form.reset({
            endHour: values.endHour,
            endMinute: values.endMinute,
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al actualizar la hora de cierre";
          setMutationError(errorMessage);
          toast.error("Error al actualizar la hora de cierre", {
            description: errorMessage,
          });
        },
      }
    );
  }

  const formErrors = form.formState.errors;
  const hasErrors =
    !!formErrors.endHour ||
    !!formErrors.endMinute ||
    !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Hora de cierre</p>
                <p className="text-sm text-muted-foreground">
                  Esta es la hora de cierre de tu empresa. Puedes cambiarla en
                  cualquier momento.
                </p>
              </div>
              <ButtonGroup className="w-full max-w-md">
                <FormField
                  control={form.control}
                  name="endHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                          disabled={isUpdatingEndHour}
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
                  name="endMinute"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                          disabled={isUpdatingEndHour}
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
                Horario de cierre para los clientes. Esto será público para todos los clientes.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.endHour && (
                    <p className="text-sm text-destructive">
                      {formErrors.endHour.message}
                    </p>
                  )}
                  {formErrors.endMinute && (
                    <p className="text-sm text-destructive">
                      {formErrors.endMinute.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingEndHour}>
              {isUpdatingEndHour ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
