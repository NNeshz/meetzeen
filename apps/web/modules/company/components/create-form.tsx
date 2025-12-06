"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/src/components/select";
import { Input } from "@meetzeen/ui/src/components/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCompany } from "@/modules/company/hooks/use-company";
import { timezones } from "@/modules/company/constants/timezones";
import { currencies } from "@/modules/company/constants/currencies";
import type { CreateCompanyFormData } from "@/modules/company/types/company.types";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(255, { message: "El nombre debe tener menos de 255 caracteres" }),
  timezone: z.string().min(1, { message: "La zona horaria es requerida" }),
  currency: z.string().min(1, { message: "La moneda es requerida" }),
});

export function CreateForm() {
  const router = useRouter();
  const { createCompany, isCreating } = useCompany();
  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      timezone: "",
      currency: "",
    },
  });

  function onSubmit(values: CreateCompanyFormData) {
    createCompany(values, {
      onSuccess: () => {
        toast.success("Compañia creada correctamente");
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error("Error al crear la compañia", {
          description: error.message,
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md mx-auto"
      >
        <div className="text-center">
          <h2 className="text-lg font-bold font-geist-mono">
            Nombre de la compañia
          </h2>
          <p className="text-sm text-muted-foreground px-4">
            Añade tu nombre, zona horaria y moneda local. Esta información la
            usaremos para perzonalizar tu experiencia.
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la compañia</FormLabel>
                <FormControl>
                  <Input placeholder="Meetzeen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zona horaria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una zona horaria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-brand text-black"
            disabled={isCreating}
          >
            {isCreating ? "Creando..." : "Crear compañia"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
