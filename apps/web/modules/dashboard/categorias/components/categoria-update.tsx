"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateCategoriaMutation } from "@/modules/dashboard/categorias/hooks/useCategorias"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@meetzeen/ui/src/components/form"
import { Input } from "@meetzeen/ui/src/components/input"
import { Button } from "@meetzeen/ui/src/components/button"

const schema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
})

export function CategoriaUpdate({ id, name }: { id: string; name: string }) {
  const updateMutation = useUpdateCategoriaMutation()
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    updateMutation.mutate({ id, name: data.name })
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
                <Input placeholder="Categoría..." {...field} />
              </FormControl>
              <FormDescription>
                Actualiza el nombre de la categoría para una mejor organización.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
        </Button>
      </form>
    </Form>
  )
}