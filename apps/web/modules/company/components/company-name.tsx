"use client";

import { Input } from "@meetzeen/ui/src/components/input";
import { Button } from "@meetzeen/ui/src/components/button";
import { useCompany } from "@/modules/company/hooks/use-company";
import { toast } from "sonner";
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

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(45, { message: "El nombre no puede exceder 45 caracteres" }),
});

export function CompanyName({
  companyName,
  onUpdate,
}: {
  companyName: string;
  onUpdate: (name: string) => void;
}) {
  const { updateCompanyName, isUpdatingCompanyName } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: companyName,
    },
  });

  useEffect(() => {
    form.reset({ name: companyName });
    setMutationError(null);
  }, [companyName, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateCompanyName(values.name, {
      onSuccess: () => {
        onUpdate(values.name);
        toast.success("Nombre actualizado correctamente");
        form.reset({ name: values.name });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar el nombre de la empresa";
        setMutationError(errorMessage);
        toast.error("Error al actualizar el nombre de la empresa", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.name || !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Nombre de la empresa</p>
                <p className="text-sm text-muted-foreground">
                  Este es el nombre de tu empresa. Puedes cambiarlo en cualquier
                  momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nombre de la empresa"
                        className="w-full max-w-md"
                        {...field}
                        disabled={isUpdatingCompanyName}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Usa como máximo 45 caracteres.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.name && (
                    <p className="text-sm text-destructive">
                      {formErrors.name.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingCompanyName}>
              {isUpdatingCompanyName ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
