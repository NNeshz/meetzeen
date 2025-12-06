"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Button } from "@meetzeen/ui/components/button";
import { IconPlus } from "@tabler/icons-react";
import { Input } from "@meetzeen/ui/src/components/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useServiceCategory } from "@/modules/service-category/hooks/use-service-category";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export function ServiceCategorySheet() {
  const [open, setOpen] = useState(false);
  const { createServiceCategory, isCreating } = useServiceCategory();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Resetear el formulario cuando se cierra el sheet
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createServiceCategory(values, {
      onSuccess: () => {
        toast.success("Categoría creada exitosamente");
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Error al crear la categoría", {
          description: error instanceof Error ? error.message : "Intenta de nuevo",
        });
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          <IconPlus className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist">
        <SheetHeader>
          <SheetTitle>Crear Categoría</SheetTitle>
          <SheetDescription>
            Crea una nueva categoría para tus servicios.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                // Detener la propagación del evento para que no afecte formularios padre
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
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
              <Button
                type="submit"
                className="w-full bg-brand text-black"
                disabled={isCreating}
              >
                {isCreating ? "Creando..." : "Crear categoría"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
