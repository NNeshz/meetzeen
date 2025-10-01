'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@meetzeen/ui/components/card'
import { Button } from '@meetzeen/ui/components/button'
import { Input } from '@meetzeen/ui/components/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@meetzeen/ui/components/form'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import { useBookingStore } from '../store/useBookingStore'
import { useStepsStore } from '../store/useStepsStore'

// Schema de validación con Zod
const customerDataSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos').regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido'),
})

type CustomerDataForm = z.infer<typeof customerDataSchema>

export function UserData() {
  const { customerData, setCustomerData } = useBookingStore()
  const { nextStep, prevStep } = useStepsStore()

  // Formulario de datos del cliente
  const customerForm = useForm<CustomerDataForm>({
    resolver: zodResolver(customerDataSchema),
    defaultValues: {
      name: customerData.name,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
    },
  })

  const onSubmitCustomerData = async (data: CustomerDataForm) => {
    setCustomerData(data)
    toast.success('Información guardada correctamente')
    nextStep()
  }

  return (
    <div className="py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit(onSubmitCustomerData)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={customerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customerForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-6">
                <Button onClick={prevStep} variant="outline" size="sm" type="button">
                  Volver
                </Button>
                <Button type="submit" size="sm">
                  Agendar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}