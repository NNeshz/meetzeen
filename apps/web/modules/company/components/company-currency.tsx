"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { currencies } from "@/modules/company/constants/currencies";
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
  currency: z.string().min(1, { message: "La moneda es requerida" }),
});

export function CompanyCurrency({
  companyCurrency,
  onUpdate,
}: {
  companyCurrency: string;
  onUpdate: (currency: string) => void;
}) {
  const { updateCompanyCurrency, isUpdatingCompanyCurrency } = useCompany();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: companyCurrency,
    },
  });

  useEffect(() => {
    form.reset({ currency: companyCurrency });
    setMutationError(null);
  }, [companyCurrency, form]);

  function handleUpdate(values: z.infer<typeof formSchema>) {
    setMutationError(null);
    updateCompanyCurrency(values.currency, {
      onSuccess: () => {
        onUpdate(values.currency);
        toast.success("Moneda actualizada correctamente");
        form.reset({ currency: values.currency });
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar la moneda de la empresa";
        setMutationError(errorMessage);
        toast.error("Error al actualizar la moneda de la empresa", {
          description: errorMessage,
        });
      },
    });
  }

  const formErrors = form.formState.errors;
  const hasErrors = !!formErrors.currency || !!mutationError;

  return (
    <div className="w-full border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">Moneda de la empresa</p>
                <p className="text-sm text-muted-foreground">
                  Esta es la moneda de tu empresa. Puedes cambiarla en
                  cualquier momento.
                </p>
              </div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingCompanyCurrency}
                      >
                        <SelectTrigger className="w-full max-w-md">
                          <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
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
                La moneda es la moneda de tu empresa. Puedes cambiarla en cualquier
                momento.
              </p>
              {hasErrors && (
                <div className="space-y-1">
                  {formErrors.currency && (
                    <p className="text-sm text-destructive">
                      {formErrors.currency.message}
                    </p>
                  )}
                  {mutationError && (
                    <p className="text-sm text-destructive">{mutationError}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isUpdatingCompanyCurrency}>
              {isUpdatingCompanyCurrency ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
