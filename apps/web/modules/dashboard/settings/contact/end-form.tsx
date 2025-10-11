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
import { Spinner } from "@meetzeen/ui/src/components/spinner";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import { ButtonGroupSeparator, ButtonGroupText } from "@meetzeen/ui/src/components/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@meetzeen/ui/src/components/select";

import { useUpdateCompanyEnd } from "@/modules/dashboard/settings/hooks/useNegocio";

const formSchema = z.object({
  endHour: z.number().min(1).max(12),
  endMinute: z.number().min(0).max(59),
  endAmPm: z.enum(["AM", "PM"]),
});

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function to12h(hour24: number) {
  const ampm: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 || 12;
  return { h12, ampm };
}

function to24h(h12: number, ampm: "AM" | "PM") {
  if (ampm === "AM") return h12 % 12;
  return (h12 % 12) + 12;
}

export function EndForm({
  endHour = 18,
  endMinute = 0,
  endAmPm = "PM",
}: {
  endHour?: number;
  endMinute?: number;
  endAmPm?: "AM" | "PM" | string;
}) {
  const initial = to12h(endHour);
  const initialAmPm =
    endAmPm === "AM" || endAmPm === "PM" ? (endAmPm as "AM" | "PM") : initial.ampm;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endHour: initial.h12,
      endMinute,
      endAmPm: initialAmPm,
    },
  });

  const { mutateAsync, isPending } = useUpdateCompanyEnd();

  const watched = form.watch();
  const isUnchanged =
    to24h(watched.endHour, watched.endAmPm) === endHour &&
    watched.endMinute === endMinute;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync({
      endHour: to24h(values.endHour, values.endAmPm),
      endMinute: values.endMinute,
      endAmPm: values.endAmPm,
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Horario de cierre</CardTitle>
        <CardDescription>
          Selecciona la hora de cierre de tu empresa.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <ButtonGroup className="w-full">
              {/* HORA */}
              <Select
                value={String(form.watch("endHour"))}
                onValueChange={(v) =>
                  form.setValue("endHour", parseInt(v, 10), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full" data-slot="select-trigger">
                  {pad(form.watch("endHour"))} h
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {pad(h)} h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* MINUTO */}
              <Select
                value={String(form.watch("endMinute"))}
                onValueChange={(v) =>
                  form.setValue("endMinute", parseInt(v, 10), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full" data-slot="select-trigger">
                  {pad(form.watch("endMinute"))} m
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {pad(m)} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* AM/PM */}
              <Select
                value={form.watch("endAmPm")}
                onValueChange={(v) =>
                  form.setValue("endAmPm", v as "AM" | "PM", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full" data-slot="select-trigger">
                  {form.watch("endAmPm")}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </ButtonGroup>

            {/* Mensajes de error debajo del ButtonGroup */}
            <FormField control={form.control} name="endHour" render={() => <FormMessage />} />
            <FormField control={form.control} name="endMinute" render={() => <FormMessage />} />
            <FormField control={form.control} name="endAmPm" render={() => <FormMessage />} />

            <FormDescription>
              Agrupamos hora, minuto y AM/PM para facilidad de uso.
            </FormDescription>
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