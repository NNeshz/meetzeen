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
  FormField,
  FormItem,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { Spinner } from "@meetzeen/ui/src/components/spinner";

import { useUpdateCompanyAddress } from "@/modules/dashboard/settings/hooks/useNegocio";

const formSchema = z.object({
  address: z
    .string()
    .min(3, { message: "La dirección debe tener al menos 3 caracteres." })
    .max(100, { message: "La dirección no puede exceder 100 caracteres." }),
});

export function AddressForm({ address }: { address: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address,
    },
  });
  const { mutateAsync, isPending } = useUpdateCompanyAddress();
  const isUnchanged = form.watch("address") === address;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values.address);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Dirección</CardTitle>
        <CardDescription>
          Esta es la dirección física que se mostrará a tus clientes. Se le
          recomienda que use una dirección o link de Google Maps para que pueda
          ser más accesible.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Av. Siempre Viva 742, Springfield"
                      {...field}
                    />
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
