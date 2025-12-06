"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
  FormField,
  FormDescription,
} from "@meetzeen/ui/src/components/form";
import { Input } from "@meetzeen/ui/src/components/input";
import { Textarea } from "@meetzeen/ui/src/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { Skeleton } from "@meetzeen/ui/src/components/skeleton";
import { useAllServiceCategories } from "@/modules/service-category/hooks/use-service-category";
import { ServiceCategorySheet } from "@/modules/service-category/components/service-category-sheet";
import { useService } from "@/modules/services/hooks/use-service";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  description: z.string().optional(),
  price: z.number().min(1, { message: "El precio es requerido" }),
  duration: z.number().min(1, { message: "La duración es requerida" }),
  discount: z.number().min(0, { message: "El descuento es requerido" }),
  serviceCategoryId: z
    .string()
    .min(1, { message: "La categoría es requerida" }),
});

export function ServiceForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    data: serviceCategories,
    isLoading: isLoadingServiceCategories,
    error: errorServiceCategories,
  } = useAllServiceCategories();
  const { createService, isCreating } = useService();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
      discount: 0,
      serviceCategoryId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createService(
      {
        name: values.name,
        serviceCategoryId: values.serviceCategoryId,
        description: values.description || "",
        price: values.price,
        duration: values.duration,
        discount: values.discount,
      },
      {
        onSuccess: () => {
          toast.success("Servicio creado exitosamente");
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Error al crear el servicio", {
            description:
              error instanceof Error ? error.message : "Intenta de nuevo",
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción <span className="text-xs text-muted-foreground">(Opcional)</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción"
                  className="resize-none"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Precio"
                  type="number"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                El precio del servicio en la moneda de la compañia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Duración"
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Duración del servicio en minutos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descuento"
                    type="number"
                    min={0}
                    max={100}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Descuento de 0% a 100%.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="serviceCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                {isLoadingServiceCategories ? (
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                ) : errorServiceCategories ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Error al cargar categorías" />
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                      <ServiceCategorySheet />
                    </div>
                    <p className="text-sm text-destructive">
                      Error al cargar las categorías. Por favor, intenta de nuevo.
                    </p>
                  </div>
                ) : !serviceCategories || serviceCategories.length === 0 ? (
                  <div className="flex gap-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="No hay categorías disponibles, crea una" />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <ServiceCategorySheet />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ServiceCategorySheet />
                  </div>
                )}
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
          {isCreating ? "Creando..." : "Crear"}
        </Button>
      </form>
    </Form>
  );
}
