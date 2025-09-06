"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@meetzeen/ui/src/components/form"
import { Input } from "@meetzeen/ui/src/components/input"
import { Button } from "@meetzeen/ui/src/components/button"

const schema = z.object({
  name: z.string().min(1, { message: "Nombre es requerido" }),
})

export function CategoriaCreate() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data)
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
                Puedes crear una categoría general, pero te recomendamos seccionar para una mejor organización.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Crear</Button>
      </form>
    </Form>
  )
}