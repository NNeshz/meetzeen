"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";

import { IconEdit } from "@tabler/icons-react";
import { useUpdateCustomer } from "@/modules/customers/hooks/use-customers";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  email: z.string().email({ message: "El email no es válido" }),
  phoneNumber: z.string().optional(),
});

export function CustomersUpdate({
  id,
  name,
  lastName,
  email,
  phoneNumber,
}: {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}) {
  const [open, setOpen] = useState(false);
  const { updateCustomer, isUpdating } = useUpdateCustomer();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: name,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber || "",
    },
  });

  // Resetear el formulario cuando se abre el sheet
  useEffect(() => {
    if (open) {
      form.reset({
        name: name,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber || "",
      });
    }
  }, [open, name, lastName, email, phoneNumber, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateCustomer(
      {
        id: id,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      },
      {
        onSuccess: () => {
          toast.success("Cliente actualizado exitosamente");
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Error al actualizar el cliente", {
            description:
              error instanceof Error ? error.message : "Intenta de nuevo",
          });
        },
      }
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" className="w-full justify-start">
          <IconEdit className="size-4 mr-2" />
          <span>Editar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Cliente</SheetTitle>
          <SheetDescription>Modifica los datos del cliente.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Teléfono{" "}
                      <span className="text-xs text-muted-foreground">
                        (Opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Teléfono"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-brand text-black"
                disabled={isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Actualizar"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
