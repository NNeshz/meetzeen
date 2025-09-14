"use client"

import { useState } from "react";
import { defineStepper } from "@stepperize/react";
import { Button } from "@meetzeen/ui/src/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@meetzeen/ui/src/components/card";
import { Input } from "@meetzeen/ui/src/components/input";
import { Label } from "@meetzeen/ui/src/components/label";
import { Services } from "./services";
import { useBookingStore } from "@/modules/landing/slug/store/useBookingStore";
import { useCheckAvailability, useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs";
import { IconCheck, IconClock, IconCalendar } from "@tabler/icons-react";

// Definir los pasos del stepper (eliminamos el paso de empleados)
const { useStepper, Scoped } = defineStepper(
  { id: "services", title: "Servicios" },
  { id: "availability", title: "Disponibilidad" },
  { id: "confirmation", title: "Confirmación" }
);

interface BookingStepperProps {
  slugName: string;
}

export function BookingStepper({ slugName }: BookingStepperProps) {
  return (
    <Scoped>
      <StepperContent slugName={slugName} />
    </Scoped>
  );
}

function StepperContent({ slugName }: { slugName: string }) {
  const { current, next, prev, isFirst, isLast } = useStepper();
  const {
    selectedServices,
    customerData,
    setCustomerData,
    getAvailabilityData,
  } = useBookingStore();

  // Obtener datos de la organización para el organizationId
  const { data: orgData } = useSlugQuery(slugName);
  const organizationId = orgData?.data?.id || "";

  const availabilityData = getAvailabilityData();
  const { data: availabilityResult, isLoading: isCheckingAvailability } = useCheckAvailability(availabilityData, organizationId);

  console.log("availabilityResult", availabilityResult);

  const canProceedFromServices = selectedServices.length > 0;
  const canProceedFromAvailability = availabilityResult && !isCheckingAvailability;
  const canCompleteBooking = customerData.name && customerData.email && customerData.phone;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (duration: string): string => {
    const minutes = parseInt(duration);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${minutes}min`;
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    const totalMinutes = selectedServices.reduce((total, service) => {
      return total + parseInt(service.duration);
    }, 0);
    return formatDuration(totalMinutes.toString());
  };

  const handleNext = () => {
    if (current.id === "services" && canProceedFromServices) {
      next();
    } else if (current.id === "availability" && canProceedFromAvailability) {
      next();
    }
  };

  const handleConfirmBooking = () => {
    if (canCompleteBooking) {
      // Aquí implementarías la lógica para confirmar la reserva
      alert('¡Reserva confirmada! (Implementar lógica de confirmación)');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Indicador de progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{current.title}</h2>
          <span className="text-sm text-muted-foreground">
            Paso {getStepNumber(current.id)} de 3
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getStepNumber(current.id) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="space-y-6">
        {current.id === "services" && (
          <>
            <Services slugName={slugName} selectable={true} />
            
            {selectedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCheck className="w-5 h-5 text-green-600" />
                    Servicios Seleccionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>{service.name}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <IconClock className="w-4 h-4" />
                            {formatDuration(service.duration)}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total: {getTotalDuration()}</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {current.id === "availability" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="w-5 h-5 text-purple-600" />
                Disponibilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCheckingAvailability ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Verificando disponibilidad...</p>
                </div>
              ) : availabilityResult ? (
                <div className="space-y-4">
                  <div className="text-green-600 font-medium">
                    ✅ Disponibilidad encontrada
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      Se encontraron {availabilityResult.data?.individual?.length || 0} slots individuales 
                      y {availabilityResult.data?.combinado?.length || 0} slots combinados disponibles.
                    </p>
                    <p className="text-sm text-green-800">
                      Los profesionales están disponibles para los servicios seleccionados.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-amber-600">
                  ⚠️ Selecciona servicios para verificar disponibilidad
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {current.id === "confirmation" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ name: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ phone: e.target.value })}
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Resumen de la reserva */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de tu Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Servicios:</h4>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>{formatPrice(service.price)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Duración:</span>
                    <span>{getTotalDuration()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={prev}
          disabled={isFirst}
        >
          Anterior
        </Button>
        
        {!isLast ? (
          <Button 
            onClick={handleNext}
            disabled={
              (current.id === "services" && !canProceedFromServices) ||
              (current.id === "availability" && !canProceedFromAvailability)
            }
          >
            Continuar
          </Button>
        ) : (
          <Button 
            onClick={handleConfirmBooking}
            disabled={!canCompleteBooking}
          >
            Confirmar Reserva
          </Button>
        )}
      </div>
    </div>
  );
}

// Función auxiliar para obtener el número del paso
function getStepNumber(stepId: string): number {
  const stepMap = {
    "services": 1,
    "availability": 2,
    "confirmation": 3
  };
  return stepMap[stepId as keyof typeof stepMap] || 1;
}