"use client";

import { Input } from "@meetzeen/ui/src/components/input";
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

const formSchema = z.object({
  location: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      { message: "Debe ser una URL válida" }
    ),
});

export function CompanyLocation({
  location,
  onUpdate,
}: {
  location?: string;
  onUpdate: () => void;
}) {
  const { updateLocation, isUpdatingLocation } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: location || "",
    },
  });

  useEffect(() => {
    form.reset({ location: location || "" });
    setMutationError(null);
  }, [location, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateLocation(values.location || "", {
      onSuccess: () => {
        onUpdate();
        toast.success("Ubicación actualizada correctamente");
        form.reset({ location: values.location });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar la ubicación";
        setMutationError(errorMessage);
        toast.error("Error al actualizar la ubicación", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.location || !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Ubicación de la empresa</p>
                <p className="text-sm text-muted-foreground">
                  Esta es la ubicación de tu empresa. Puedes cambiarla en cualquier
                  momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Ubicación de la empresa"
                        className="w-full max-w-md"
                        {...field}
                        disabled={isUpdatingLocation}
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
                Preferentemente usa un link de Google Maps.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.location && (
                    <p className="text-sm text-destructive">
                      {formErrors.location.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingLocation}>
              {isUpdatingLocation ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
