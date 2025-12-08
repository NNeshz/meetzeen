"use client";

import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { Button } from "@meetzeen/ui/src/components/button";
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

const DAYS = [
  { value: 1, label: "Lunes" }, // Monday = 1
  { value: 2, label: "Martes" }, // Tuesday = 2
  { value: 3, label: "Miércoles" }, // Wednesday = 3
  { value: 4, label: "Jueves" }, // Thursday = 4
  { value: 5, label: "Viernes" }, // Friday = 5
  { value: 6, label: "Sábado" }, // Saturday = 6
  { value: 0, label: "Domingo" }, // Sunday = 0
];

const formSchema = z.object({
  workdays: z
    .array(z.number().min(0).max(6))
    .min(1, { message: "Debes seleccionar al menos un día" }),
});

export function CompanyWorkdays({
  workdays,
  onUpdate,
}: {
  workdays: number[];
  onUpdate: () => void;
}) {
  const { updateCompanyWorkdays, isUpdatingCompanyWorkdays } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workdays: workdays || [],
    },
  });

  useEffect(() => {
    form.reset({ workdays: workdays || [] });
    setMutationError(null);
  }, [workdays, form]);

  function toggleDay(day: number) {
    const currentWorkdays = form.getValues("workdays") || [];
    const newWorkdays = currentWorkdays.includes(day)
      ? currentWorkdays.filter((d) => d !== day)
      : [...currentWorkdays, day];
    form.setValue("workdays", newWorkdays);
  }

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateCompanyWorkdays(values.workdays, {
      onSuccess: () => {
        onUpdate();
        toast.success("Días laborables actualizados correctamente");
        form.reset({ workdays: values.workdays });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar los días laborables";
        setMutationError(errorMessage);
        toast.error("Error al actualizar los días laborables", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.workdays || !!mutationError;
  const currentWorkdays = form.watch("workdays") || [];

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Días laborables</p>
                <p className="text-sm text-muted-foreground">
                  Selecciona los días de la semana en que tu empresa está abierta.
                  Puedes cambiarlos en cualquier momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="workdays"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ButtonGroup className="w-full max-w-md">
                        <ButtonGroup className="w-full">
                          {DAYS.map((d) => {
                            const selected = currentWorkdays.includes(d.value);
                            return (
                              <Button
                                key={d.value}
                                type="button"
                                className="flex-1"
                                variant={selected ? "default" : "outline"}
                                onClick={() => toggleDay(d.value)}
                                disabled={isUpdatingCompanyWorkdays}
                              >
                                {d.label}
                              </Button>
                            );
                          })}
                        </ButtonGroup>
                      </ButtonGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Selecciona los días de la semana en que tu empresa está abierta.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.workdays && (
                    <p className="text-sm text-destructive">
                      {formErrors.workdays.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingCompanyWorkdays}>
              {isUpdatingCompanyWorkdays ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
