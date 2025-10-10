"use client";

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
  FormLabel,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(50, {
      message: "El nombre no puede exceder 50 caracteres.",
    }),
});

export function NameForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Vikingo Barbon",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Nombre de la empresa</CardTitle>
        <CardDescription>
          Este es el nombre visible de tu empresa dentro de Meetzeen. Por ejemplo, el nombre de tu empresa o departamento.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Vikingo Barbon" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    El nombre debe tener entre 2 y 50 caracteres.
                  </FormDescription>
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
