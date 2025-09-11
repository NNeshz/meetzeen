"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateServicioMutation } from "@/modules/dashboard/servicios/hooks/useServicios"
import { useCategoriasQuery } from "@/modules/dashboard/categorias/hooks/useCategorias"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@meetzeen/ui/src/components/form"
import { Input } from "@meetzeen/ui/src/components/input"
import { Button } from "@meetzeen/ui/src/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@meetzeen/ui/src/components/select"

const schema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
  duration: z.number().min(1, { message: "La duración debe ser al menos 1 minuto" }).max(1440, { message: "La duración no puede exceder 24 horas (1440 minutos)" }),
  price: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  categoryId: z.string().min(1, { message: "Categoría es requerida" }),
})

interface ServicioCreateProps {
  onSuccess?: () => void;
}

export function ServicioCreate({ onSuccess }: ServicioCreateProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 0,
      categoryId: "",
    },
  })

  const createServicioMutation = useCreateServicioMutation()
  const { data: categoriasData, isLoading: categoriasLoading } = useCategoriasQuery()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createServicioMutation.mutateAsync({
        name: data.name,
        duration: data.duration.toString(),
        price: data.price,
        categoryId: data.categoryId,
      })
      
      form.reset()
      
      onSuccess?.()
    } catch (error) {
      console.error('Error al crear servicio:', error)
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nombre del servicio..." 
                  {...field} 
                  disabled={createServicioMutation.isPending}
                />
              </FormControl>
              <FormDescription>
                Ingresa un nombre descriptivo para tu servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (minutos)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="30" 
                  min="1"
                  max="1440"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                  disabled={createServicioMutation.isPending}
                />
              </FormControl>
              <FormDescription>
                Duración del servicio en minutos (ej: 30, 60, 90).
              </FormDescription>
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
                  type="number"
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  disabled={createServicioMutation.isPending}
                />
              </FormControl>
              <FormDescription>
                Precio del servicio en tu moneda local.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={createServicioMutation.isPending || categoriasLoading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriasData?.data?.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecciona la categoría a la que pertenece este servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={createServicioMutation.isPending || categoriasLoading}
        >
          {createServicioMutation.isPending ? "Creando..." : "Crear Servicio"}
        </Button>
      </form>
    </Form>
  )
}