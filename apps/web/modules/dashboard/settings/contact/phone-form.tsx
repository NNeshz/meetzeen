"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { Spinner } from "@meetzeen/ui/src/components/spinner";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@meetzeen/ui/src/components/select";

import { useUpdateCompanyPhoneNumber } from "@/modules/dashboard/settings/hooks/useNegocio";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(7, { message: "El teléfono debe tener al menos 7 caracteres." })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres." }),
});

export function PhoneForm({ phoneNumber }: { phoneNumber: string }) {
  const COUNTRY_CODES = [
    { value: "+1", label: "Estados Unidos", emoji: "🇺🇸" },
    { value: "+52", label: "México", emoji: "🇲🇽" },
    { value: "+55", label: "Brasil", emoji: "🇧🇷" },
    { value: "+54", label: "Argentina", emoji: "🇦🇷" },
    { value: "+57", label: "Colombia", emoji: "🇨🇴" },
    { value: "+56", label: "Chile", emoji: "🇨🇱" },
    { value: "+51", label: "Perú", emoji: "🇵🇪" },
    { value: "+58", label: "Venezuela", emoji: "🇻🇪" },
    { value: "+593", label: "Ecuador", emoji: "🇪🇨" },
    { value: "+591", label: "Bolivia", emoji: "🇧🇴" },
    { value: "+595", label: "Paraguay", emoji: "🇵🇾" },
    { value: "+598", label: "Uruguay", emoji: "🇺🇾" },
    { value: "+506", label: "Costa Rica", emoji: "🇨🇷" },
    { value: "+507", label: "Panamá", emoji: "🇵🇦" },
    { value: "+502", label: "Guatemala", emoji: "🇬🇹" },
    { value: "+503", label: "El Salvador", emoji: "🇸🇻" },
    { value: "+504", label: "Honduras", emoji: "🇭🇳" },
    { value: "+505", label: "Nicaragua", emoji: "🇳🇮" },
    { value: "+53", label: "Cuba", emoji: "🇨🇺" },
  ];

  function splitPhone(raw: string) {
    const trimmed = (raw ?? "").trim();
    const sortedCodes = [...COUNTRY_CODES.map((c) => c.value)].sort(
      (a, b) => b.length - a.length
    );
    const found = sortedCodes.find((code) => trimmed.startsWith(code));
    const code = found ?? "+52";
    const local = found ? trimmed.slice(code.length).trim() : trimmed;
    return { code, local };
  }

  const initial = React.useMemo(() => splitPhone(phoneNumber), [phoneNumber]);
  const [dialCode, setDialCode] = React.useState<string>(initial.code);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: initial.local,
    },
  });

  const { mutateAsync, isPending } = useUpdateCompanyPhoneNumber();

  const initialNormalized = React.useMemo(() => {
    const s = splitPhone(phoneNumber);
    return {
      code: s.code,
      local: s.local.replace(/[^\d]/g, ""),
    };
  }, [phoneNumber]);

  const currentNormalized = {
    code: dialCode,
    local: (form.watch("phoneNumber") ?? "").replace(/[^\d]/g, ""),
  };

  const isUnchanged =
    currentNormalized.code === initialNormalized.code &&
    currentNormalized.local === initialNormalized.local;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const combined = `${dialCode} ${values.phoneNumber}`.trim();
    await mutateAsync(combined);
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.value === dialCode);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Número de teléfono</CardTitle>
        <CardDescription>
          Este es el teléfono de contacto que se mostrará a tus clientes.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ButtonGroup className="w-full">
                      <ButtonGroup className="w-full">
                        <Select value={dialCode} onValueChange={setDialCode}>
                          <SelectTrigger>
                            {selectedCountry?.emoji} {dialCode}
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.emoji} {country.label} {country.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="tel"
                          className="w-full"
                          placeholder="55 1234 5678"
                          pattern="[0-9\\s\\-]*"
                          {...field}
                        />
                      </ButtonGroup>
                    </ButtonGroup>
                  </FormControl>
                  {/* Dejamos los estilos por defecto, sin clases extra */}
                  <FormDescription>
                    Selecciona la lada y escribe tu número local.
                  </FormDescription>
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