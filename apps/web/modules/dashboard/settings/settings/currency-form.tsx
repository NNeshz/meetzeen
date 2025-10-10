"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

const currencySchema = z.object({
  currency: z.enum(CURRENCIES.map((curr) => curr.value) as [string, ...string[]], {
    message: "Selecciona una moneda.",
  }),
});

const getDefaultCurrency = (currency: string) => {
  return CURRENCIES.find((curr) => curr.value === currency)?.value || "USD";
};

export function CurrencyForm({ currency }: { currency: string }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof currencySchema>>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      currency: getDefaultCurrency(currency),
    },
  });

  // 2. Define your form submission handler.
  const onSubmit = (values: z.infer<typeof currencySchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Moneda</CardTitle>
        <CardDescription>
          Selecciona la moneda principal de tu empresa. Esto afectará cómo se
          muestran los precios y las transacciones en toda la aplicación.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            {curr.label}
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
            <Button type="submit">Guardar</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}