"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import { Button } from "@meetzeen/ui/src/components/button";
import { Spinner } from "@meetzeen/ui/src/components/spinner";
import { useUpdateCompanyTimezone } from "@/modules/dashboard/settings/hooks/useNegocio";

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

const timezoneSchema = z.object({
  timezone: z.enum(TIMEZONES.map((tz) => tz.value) as [string, ...string[]], {
    message: "Selecciona una zona horaria.",
  }),
});

const getDefaultTimezone = (timezone: string) => {
  return TIMEZONES.find((tz) => tz.value === timezone)?.value || "UTC";
};

export function TimezoneForm({ timezone }: { timezone: string }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof timezoneSchema>>({
    resolver: zodResolver(timezoneSchema),
    defaultValues: {
      timezone: getDefaultTimezone(timezone),
    },
  });
  const { mutateAsync, isPending } = useUpdateCompanyTimezone();
  const initialTimezone = getDefaultTimezone(timezone);
  const isUnchanged = form.watch("timezone") === initialTimezone;

  const onSubmit = async (values: z.infer<typeof timezoneSchema>) => {
    await mutateAsync(values.timezone);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Zona horaria</CardTitle>
        <CardDescription>
          Selecciona la zona horaria de tu empresa. Esto afectará la hora en la
          que se muestren los eventos y las notificaciones.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una zona horaria" />
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
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isPending || isUnchanged}>
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
