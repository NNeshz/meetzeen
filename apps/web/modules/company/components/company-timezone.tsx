"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { timezones } from "@/modules/company/constants/timezones";
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

const formSchema = z.object({
  timezone: z.string().min(1, { message: "La zona horaria es requerida" }),
});

export function CompanyTimezone({
  companyTimezone,
  onUpdate,
}: {
  companyTimezone: string;
  onUpdate: (timezone: string) => void;
}) {
  const { updateCompanyTimezone, isUpdatingCompanyTimezone } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone: companyTimezone,
    },
  });

  useEffect(() => {
    form.reset({ timezone: companyTimezone });
    setMutationError(null);
  }, [companyTimezone, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateCompanyTimezone(values.timezone, {
      onSuccess: () => {
        onUpdate(values.timezone);
        toast.success("Zona horaria actualizada correctamente");
        form.reset({ timezone: values.timezone });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar la zona horaria de la empresa";
        setMutationError(errorMessage);
        toast.error("Error al actualizar la zona horaria de la empresa", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.timezone || !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Zona horaria de la empresa</p>
                <p className="text-sm text-muted-foreground">
                  Este es la zona horaria de tu empresa. Puedes cambiarlo en
                  cualquier momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingCompanyTimezone}
                      >
                        <SelectTrigger className="w-full max-w-md">
                          <SelectValue placeholder="Selecciona una zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((timezone) => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                La zona horaria es la zona horaria de tu empresa o donde te encuentras.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.timezone && (
                    <p className="text-sm text-destructive">
                      {formErrors.timezone.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingCompanyTimezone}>
              {isUpdatingCompanyTimezone ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
