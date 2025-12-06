"use client";

import { useState, useEffect } from "react";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@meetzeen/ui/src/components/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { IconEdit } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useServiceCategory } from "@/modules/service-category/hooks/use-service-category";
import type { ServiceCategory } from "@/modules/service-category/types/service-category.types";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export function ServiceCategoryUpdateSheet({
  serviceCategory,
}: {
  serviceCategory: ServiceCategory;
}) {
  const [open, setOpen] = useState(false);
  const { updateServiceCategory, isUpdating } = useServiceCategory();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: serviceCategory.name,
    },
  });

  // Resetear el formulario cuando se abre el sheet o cambia la categoría
  useEffect(() => {
    if (open) {
      form.reset({
        name: serviceCategory.name,
      });
    }
  }, [open, serviceCategory.name, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateServiceCategory(
      {
        id: serviceCategory.id,
        name: values.name,
      },
      {
        onSuccess: () => {
          toast.success("Categoría actualizada exitosamente");
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Error al actualizar la categoría", {
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
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
          <IconEdit className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist">
        <SheetHeader>
          <SheetTitle>Editar Categoría</SheetTitle>
          <SheetDescription>
            Modifica el nombre de la categoría de servicio.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
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
                disabled={isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Actualizar categoría"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
