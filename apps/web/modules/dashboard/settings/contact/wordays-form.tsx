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

import { useUpdateCompanyWorkdays } from "@/modules/dashboard/settings/hooks/useNegocio";

const formSchema = z.object({
  workdays: z.array(z.number()).min(1, { message: "Selecciona al menos un día." }).max(7),
});

const DAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 7, label: "Dom" },
];

export function WordaysForm({ workdays = [1, 2, 3, 4, 5] }: { workdays?: number[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workdays,
    },
  });

  const { mutateAsync, isPending } = useUpdateCompanyWorkdays();

  const currentDays = form.watch("workdays");
  const isUnchanged =
    JSON.stringify([...currentDays].sort()) === JSON.stringify([...workdays].sort());

  function toggleDay(day: number) {
    const set = new Set(form.getValues("workdays"));
    if (set.has(day)) {
      set.delete(day);
    } else {
      set.add(day);
    }
    const next = Array.from(set);
    form.setValue("workdays", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values.workdays);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Días de trabajo</CardTitle>
        <CardDescription>Selecciona los días que atiendes.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="workdays"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ButtonGroup className="w-full">
                      <ButtonGroup className="w-full">
                        {DAYS.map((d) => {
                          const selected = currentDays.includes(d.value);
                          return (
                            <Button
                              key={d.value}
                              type="button"
                              className="flex-1"
                              variant={selected ? "default" : "outline"}
                              onClick={() => toggleDay(d.value)}
                            >
                              {d.label}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </ButtonGroup>
                  </FormControl>
                  <FormDescription>
                    Toca los días para activarlos o desactivarlos.
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