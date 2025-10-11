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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@meetzeen/ui/src/components/select";

import { useUpdateCompanyStart } from "@/modules/dashboard/settings/hooks/useNegocio";

const formSchema = z.object({
  startHour: z.number().min(1).max(12),
  startMinute: z.number().min(0).max(59),
  startAmPm: z.enum(["AM", "PM"]),
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

export function StartForm({
  startHour = 9,
  startMinute = 0,
  startAmPm = "AM",
}: {
  startHour?: number;
  startMinute?: number;
  startAmPm?: "AM" | "PM" | string;
}) {
  const initial = to12h(startHour);
  const initialAmPm =
    startAmPm === "AM" || startAmPm === "PM" ? (startAmPm as "AM" | "PM") : initial.ampm;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startHour: initial.h12,
      startMinute,
      startAmPm: initialAmPm,
    },
  });

  const { mutateAsync, isPending } = useUpdateCompanyStart();

  const watched = form.watch();
  const isUnchanged =
    to24h(watched.startHour, watched.startAmPm) === startHour &&
    watched.startMinute === startMinute;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync({
      startHour: to24h(values.startHour, values.startAmPm),
      startMinute: values.startMinute,
      startAmPm: values.startAmPm,
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Horario de inicio</CardTitle>
        <CardDescription>
          Selecciona la hora de apertura de tu empresa.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <div className="space-y-2">
              <ButtonGroup className="w-full">
                {/* HORA */}
                <Select
                  value={String(form.watch("startHour"))}
                  onValueChange={(v) =>
                    form.setValue("startHour", parseInt(v, 10), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full" data-slot="select-trigger">
                    {pad(form.watch("startHour"))} h
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
                  value={String(form.watch("startMinute"))}
                  onValueChange={(v) =>
                    form.setValue("startMinute", parseInt(v, 10), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full" data-slot="select-trigger">
                    {pad(form.watch("startMinute"))} m
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
                  value={form.watch("startAmPm")}
                  onValueChange={(v) =>
                    form.setValue("startAmPm", v as "AM" | "PM", {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full" data-slot="select-trigger">
                    {form.watch("startAmPm")}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </ButtonGroup>

              {/* Mensajes de error debajo del ButtonGroup */}
              <FormField
                control={form.control}
                name="startHour"
                render={() => <FormMessage />}
              />
              <FormField
                control={form.control}
                name="startMinute"
                render={() => <FormMessage />}
              />
              <FormField
                control={form.control}
                name="startAmPm"
                render={() => <FormMessage />}
              />

              <FormDescription>
                Agrupamos hora, minuto y AM/PM para facilidad de uso.
              </FormDescription>
            </div>
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