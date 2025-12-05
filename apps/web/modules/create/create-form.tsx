"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Form,
  FormControl,
  FormDescription,
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

// Zonas horarias con nombres amigables
const timezones = [
  { value: "America/Mexico_City", label: "Ciudad de Mexico" },
  { value: "America/New_York", label: "Nueva York" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Denver", label: "Denver" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Phoenix", label: "Phoenix" },
  { value: "America/Anchorage", label: "Anchorage" },
  { value: "America/Honolulu", label: "Honolulu" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "America/Montreal", label: "Montreal" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Sao_Paulo", label: "Sao Paulo" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/Bogota", label: "Bogota" },
  { value: "America/Lima", label: "Lima" },
  { value: "America/Caracas", label: "Caracas" },
  { value: "America/Montevideo", label: "Montevideo" },
  { value: "America/La_Paz", label: "La Paz" },
  { value: "America/Asuncion", label: "Asuncion" },
  { value: "America/Guayaquil", label: "Guayaquil" },
  { value: "America/Guatemala", label: "Guatemala" },
  { value: "America/Tegucigalpa", label: "Tegucigalpa" },
  { value: "America/Managua", label: "Managua" },
  { value: "America/San_Jose", label: "San Jose" },
  { value: "America/Panama", label: "Panama" },
  { value: "America/Havana", label: "Havana" },
  { value: "America/Santo_Domingo", label: "Santo Domingo" },
  { value: "America/San_Juan", label: "San Juan" },
  { value: "America/El_Salvador", label: "El Salvador" },
  { value: "Europe/London", label: "Londres" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Europe/Madrid", label: "Madrid" },
  { value: "Europe/Rome", label: "Roma" },
  { value: "Europe/Amsterdam", label: "Amsterdam" },
  { value: "Europe/Brussels", label: "Bruselas" },
  { value: "Europe/Vienna", label: "Viena" },
  { value: "Europe/Zurich", label: "Zurich" },
  { value: "Europe/Stockholm", label: "Estocolmo" },
  { value: "Europe/Oslo", label: "Oslo" },
  { value: "Europe/Copenhagen", label: "Copenhague" },
  { value: "Europe/Helsinki", label: "Helsinki" },
  { value: "Europe/Warsaw", label: "Varsovia" },
  { value: "Europe/Prague", label: "Praga" },
  { value: "Europe/Budapest", label: "Budapest" },
  { value: "Europe/Athens", label: "Atenas" },
  { value: "Europe/Lisbon", label: "Lisboa" },
  { value: "Europe/Dublin", label: "Dublin" },
  { value: "Europe/Moscow", label: "Moscu" },
  { value: "Asia/Tokyo", label: "Tokio" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Singapore", label: "Singapur" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Kolkata", label: "Mumbai" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Australia/Melbourne", label: "Melbourne" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "Africa/Johannesburg", label: "Johannesburgo" },
  { value: "Africa/Cairo", label: "El Cairo" },
  { value: "Africa/Lagos", label: "Lagos" },
];

// Monedas importantes
const currencies = [
  // LATAM
  { value: "MXN", label: "Peso Mexicano (MXN)" },
  { value: "ARS", label: "Peso Argentino (ARS)" },
  { value: "BRL", label: "Real Brasileño (BRL)" },
  { value: "CLP", label: "Peso Chileno (CLP)" },
  { value: "COP", label: "Peso Colombiano (COP)" },
  { value: "PEN", label: "Sol Peruano (PEN)" },
  { value: "UYU", label: "Peso Uruguayo (UYU)" },
  { value: "VES", label: "Bolívar Venezolano (VES)" },
  { value: "BOB", label: "Boliviano (BOB)" },
  { value: "PYG", label: "Guaraní Paraguayo (PYG)" },
  { value: "GTQ", label: "Quetzal Guatemalteco (GTQ)" },
  { value: "HNL", label: "Lempira Hondureño (HNL)" },
  { value: "NIO", label: "Córdoba Nicaragüense (NIO)" },
  { value: "CRC", label: "Colón Costarricense (CRC)" },
  { value: "PAB", label: "Balboa Panameño (PAB)" },
  { value: "DOP", label: "Peso Dominicano (DOP)" },
  { value: "CUP", label: "Peso Cubano (CUP)" },
  // USD
  { value: "USD", label: "Dólar Estadounidense (USD)" },
  // Europa
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "Libra Esterlina (GBP)" },
  { value: "CHF", label: "Franco Suizo (CHF)" },
  { value: "SEK", label: "Corona Sueca (SEK)" },
  { value: "NOK", label: "Corona Noruega (NOK)" },
  { value: "DKK", label: "Corona Danesa (DKK)" },
  { value: "PLN", label: "Złoty Polaco (PLN)" },
  { value: "CZK", label: "Corona Checa (CZK)" },
  { value: "HUF", label: "Forinto Húngaro (HUF)" },
  { value: "RON", label: "Leu Rumano (RON)" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(255, { message: "El nombre debe tener menos de 255 caracteres" }),
  timezone: z.string().min(1, { message: "La zona horaria es requerida" }),
  currency: z.string().min(1, { message: "La moneda es requerida" }),
});

export function CreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      timezone: "",
      currency: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Call the API to create the organization
    console.log(values);
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

          <Button type="submit" className="w-full bg-brand text-black">
            Crear compañia
          </Button>
        </div>
      </form>
    </Form>
  );
}
