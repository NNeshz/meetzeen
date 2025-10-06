"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@meetzeen/ui/components/button"
import { Input } from "@meetzeen/ui/components/input"
import { Label } from "@meetzeen/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle } from "@meetzeen/ui/components/card"
import { useBookingStores } from "../store/useBookingStores"
import { toast } from "sonner"

const customerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
})

type CustomerFormData = z.infer<typeof customerSchema>

export function UserData() {
  const { 
    customerData, 
    setCustomerData, 
    nextStep, 
    prevStep 
  } = useBookingStores()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customerData,
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setCustomerData(data)
      toast.success("Datos guardados correctamente")
      nextStep()
    } catch (error) {
      toast.error("Error al guardar los datos")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Tu nombre"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Tu apellido"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Tu número de teléfono"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Guardando..." : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}