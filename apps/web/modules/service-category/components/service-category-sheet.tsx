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
import { useAllServiceCategories } from "@/modules/service-category/hooks/use-service-category";
import { Skeleton } from "@meetzeen/ui/src/components/skeleton";
import { ServiceCategoryUpdateSheet } from "@/modules/service-category/components/service-category-update-sheet";
import { ServiceCategoryDeleteDialog } from "@/modules/service-category/components/service-category-delete-dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export function ServiceCategorySheet() {
  const [open, setOpen] = useState(false);
  const { createServiceCategory, isCreating } = useServiceCategory();
  const {
    data: serviceCategories,
    isLoading: isLoadingServiceCategories,
    error: errorServiceCategories,
  } = useAllServiceCategories();
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
          description:
            error instanceof Error ? error.message : "Intenta de nuevo",
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

        <div className="px-4">
          {isLoadingServiceCategories ? (
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          ) : errorServiceCategories ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">
                Error al cargar las categorías. Por favor, intenta de nuevo.
              </p>
            </div>
          ) : !serviceCategories || serviceCategories.length === 0 ? (
            <div className="flex gap-2">
              <p className="text-sm text-destructive">
                No hay categorías disponibles. Por favor, crea una.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {serviceCategories.map((category) => (
                <div
                  key={category.id}
                  className="w-full flex items-center justify-between border rounded-md px-4 py-2"
                >
                  <span className="text-base">{category.name}</span>
                  <div className="flex gap-2">
                    <ServiceCategoryUpdateSheet serviceCategory={category} />
                    <ServiceCategoryDeleteDialog serviceCategory={category} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
