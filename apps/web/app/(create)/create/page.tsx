"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Temporal } from "temporal-polyfill";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/src/components/select";
import { useCreateCompany } from "@/modules/dashboard/negocio/hooks/useNegocio";

// 🌎 Timezones relevantes (LatAm + USA)
const TIMEZONES = [
  { value: "UTC", label: "UTC — Tiempo Universal Coordinado" },
  { value: "America/Mexico_City", label: "Ciudad de México (México)" },
  { value: "America/Cancun", label: "Cancún (México)" },
  { value: "America/Tijuana", label: "Tijuana (México)" },
  { value: "America/Bogota", label: "Bogotá (Colombia)" },
  { value: "America/Lima", label: "Lima (Perú)" },
  { value: "America/Santiago", label: "Santiago (Chile)" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "Buenos Aires (Argentina)",
  },
  { value: "America/Caracas", label: "Caracas (Venezuela)" },
  { value: "America/Guatemala", label: "Guatemala (Guatemala)" },
  { value: "America/Montevideo", label: "Montevideo (Uruguay)" },
  { value: "America/Panama", label: "Ciudad de Panamá (Panamá)" },
  { value: "America/Asuncion", label: "Asunción (Paraguay)" },
  { value: "America/La_Paz", label: "La Paz (Bolivia)" },
  { value: "America/San_Jose", label: "San José (Costa Rica)" },
  { value: "America/Managua", label: "Managua (Nicaragua)" },
  { value: "America/Tegucigalpa", label: "Tegucigalpa (Honduras)" },
  { value: "America/Santo_Domingo", label: "Santo Domingo (R. Dominicana)" },
  // 🇺🇸 Estados Unidos
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Denver", label: "Denver (MST)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (PST)" },
  { value: "America/Anchorage", label: "Anchorage (Alaska)" },
  { value: "Pacific/Honolulu", label: "Honolulu (Hawái)" },
] as const;

const CURRENCY_CODES = [
  "USD",
  "EUR",
  "MXN",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "UYU",
  "DOP",
  "PYG",
  "BOB",
  "GTQ",
  "HNL",
  "NIO",
  "CRC",
  "PAB",
  "VES",
] as const;

const CURRENCIES = [
  { value: "USD", label: "USD — Dólar estadounidense" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "MXN", label: "MXN — Peso mexicano" },
  { value: "ARS", label: "ARS — Peso argentino" },
  { value: "CLP", label: "CLP — Peso chileno" },
  { value: "COP", label: "COP — Peso colombiano" },
  { value: "PEN", label: "PEN — Sol peruano" },
  { value: "UYU", label: "UYU — Peso uruguayo" },
  { value: "DOP", label: "DOP — Peso dominicano" },
  { value: "PYG", label: "PYG — Guaraní paraguayo" },
  { value: "BOB", label: "BOB — Boliviano" },
  { value: "GTQ", label: "GTQ — Quetzal guatemalteco" },
  { value: "HNL", label: "HNL — Lempira hondureño" },
  { value: "NIO", label: "NIO — Córdoba nicaragüense" },
  { value: "CRC", label: "CRC — Colón costarricense" },
  { value: "PAB", label: "PAB — Balboa panameño" },
  { value: "VES", label: "VES — Bolívar venezolano" },
] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre de la empresa es obligatorio." }),
  timezone: z.enum(TIMEZONES.map((tz) => tz.value) as [string, ...string[]], {
    message: "Selecciona una zona horaria.",
  }),
  currency: z.enum(CURRENCY_CODES, { message: "Selecciona una moneda." }),
});

// Helper para convertir el timezone del sistema al tipo del union
function getDefaultTimezone(tz: string): (typeof TIMEZONES)[number]["value"] {
  const validTimezones = TIMEZONES.map((t) => t.value);
  return (validTimezones as readonly string[]).includes(tz)
    ? (tz as (typeof TIMEZONES)[number]["value"])
    : "UTC";
}

export default function Page() {
  const systemTimezone = Temporal.Now.timeZoneId();
  const defaultTimezone = getDefaultTimezone(systemTimezone);
  const createOrganizationMutation = useCreateCompany();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      timezone: defaultTimezone,
      currency: "MXN",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrganizationMutation.mutate(values);
  }

  return (
    <>
      <div className="fixed top-4 left-4 md:top-8 md:left-8">
        <Link href="/" aria-label="Ir al inicio">
          <Image
            src="/landing/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Configura tu empresa</h1>
            <p className="text-muted-foreground">
              Configura los datos básicos de tu empresa para comenzar a usar
              Meetzeen.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la empresa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej. Acme S.A." 
                        {...field} 
                        disabled={createOrganizationMutation.isPending}
                      />
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
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={createOrganizationMutation.isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={createOrganizationMutation.isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona la moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="sm"
                  disabled={createOrganizationMutation.isPending}
                >
                  {createOrganizationMutation.isPending ? "Creando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
