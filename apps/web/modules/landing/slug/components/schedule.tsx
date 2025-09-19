'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@meetzeen/ui/components/calendar'
import { Button } from '@meetzeen/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@meetzeen/ui/components/card'
import { Badge } from '@meetzeen/ui/components/badge'
import { Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useBookingStore, type DateAvailability, type ServiceSlot } from '../store/useBookingStore'
import { useStepsStore } from '../store/useStepsStore'

export function Schedule() {
  const { 
    availabilityData,
    selectedServicesWithEmployees,
    setServiceSelection,
    getServiceSelection,
    areAllServiceSelectionsComplete,
    applySlotSelection,
    clearSlotSelection,
    canUseSlot,
    isUsingSlot
  } = useBookingStore()
  const { nextStep, prevStep } = useStepsStore()
  
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0)
  const [availableHours, setAvailableHours] = useState<string[]>([])
  const [showSlotSuggestion, setShowSlotSuggestion] = useState(false)

  // Verificar si se puede mostrar sugerencia de slot al cargar
  useEffect(() => {
    if (canUseSlot() && !isUsingSlot) {
      setShowSlotSuggestion(true)
    }
  }, [availabilityData, selectedServicesWithEmployees, canUseSlot, isUsingSlot])

  const getScenarioType = () => {
    if (selectedServicesWithEmployees.length === 0) return 'none'
    
    const totalEmployees = selectedServicesWithEmployees.reduce(
      (total, item) => total + item.selectedEmployees.length, 0
    )
    
    if (selectedServicesWithEmployees.length === 1 && totalEmployees === 1) {
      return '1:1' // 1 servicio, 1 empleado
    } else if (selectedServicesWithEmployees.every(item => item.selectedEmployees.length === 1)) {
      return 'X:X' // X servicios, X empleados (1 empleado por servicio)
    } else if (totalEmployees === 1) {
      return 'X:1' // X servicios, 1 empleado
    } else {
      return 'complex' // Escenario complejo (múltiples empleados por servicio)
    }
  }

  const scenarioType = getScenarioType()
  const currentService = selectedServicesWithEmployees[currentServiceIndex]
  const currentEmployee = currentService?.selectedEmployees[currentEmployeeIndex]

  // Manejar aceptación de slot sugerido
  const handleAcceptSlot = () => {
    if (availabilityData?.set) {
      applySlotSelection(availabilityData.set)
      setShowSlotSuggestion(false)
      toast.success('Horario conjunto confirmado', {
        description: 'Todos tus servicios han sido programados de forma consecutiva'
      })
    }
  }

  // Manejar rechazo de slot sugerido
  const handleRejectSlot = () => {
    setShowSlotSuggestion(false)
  }

  // Renderizar sugerencia de slot
  const renderSlotSuggestion = () => {
    if (!showSlotSuggestion || !availabilityData?.set || !availabilityData.set.services) {
      return null
    }

    const slot = availabilityData.set
    const services = slot.services

    // Validación adicional para evitar undefined
    if (!services || services.length === 0) {
      return null
    }

    return (
      <Card className="mb-6 border-muted bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5" />
            ¡Horario conjunto disponible!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Encontramos un horario donde puedes tener todos tus servicios de forma consecutiva:
            </p>
            
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">
                  {slot.day.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <Badge variant="secondary">
                  {slot.startHour} - {slot.endHour}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {services
                  .sort((a, b) => a.order - b.order)
                  .map((serviceSlot, index) => {
                    const service = selectedServicesWithEmployees
                      .find(s => s.service.id === serviceSlot.serviceId)?.service
                    const employee = selectedServicesWithEmployees
                      .flatMap(s => s.selectedEmployees)
                      .find(e => e.id === serviceSlot.employeeId)
                    
                    return (
                      <div key={`${serviceSlot.serviceId}-${serviceSlot.employeeId}`} 
                           className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">
                          {serviceSlot.order}
                        </Badge>
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{service?.name}</span>
                          <span className="text-muted-foreground"> con {employee?.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {serviceSlot.startTime} - {serviceSlot.endTime}
                        </div>
                        {index < services.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleAcceptSlot} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceptar horario conjunto
              </Button>
              <Button onClick={handleRejectSlot} variant="outline">
                Seleccionar individualmente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Obtener fechas disponibles según el escenario
  const getAvailableDates = (): Date[] => {
    if (!availabilityData?.individuals) return []
    
    if (scenarioType === '1:1') {
      // Escenario simple: 1 servicio, 1 empleado
      const availability = availabilityData.individuals[0]
      return availability?.datesAvailable?.map(dateAvail => dateAvail.day) || []
    } else if (scenarioType === 'X:1') {
      // X servicios, 1 empleado: mostrar disponibilidad del empleado único
      const employeeId = selectedServicesWithEmployees[0]?.selectedEmployees[0]?.id
      const availability = availabilityData.individuals.find(ind => ind.employeeId === employeeId)
      return availability?.datesAvailable?.map(dateAvail => dateAvail.day) || []
    } else if (scenarioType === 'X:X' && currentEmployee) {
      // X servicios, X empleados: mostrar disponibilidad del empleado actual
      const availability = availabilityData.individuals.find(
        ind => ind.employeeId === currentEmployee.id && ind.serviceId === currentService.service.id
      )
      return availability?.datesAvailable?.map(dateAvail => dateAvail.day) || []
    }
    
    return []
  }

  // Manejar selección de fecha
  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !currentService || !currentEmployee) return
    
    const currentSelection = getServiceSelection(currentService.service.id, currentEmployee.id)
    setServiceSelection(currentService.service.id, currentEmployee.id, date, null)
    
    // Buscar horarios disponibles para la fecha seleccionada
    let availability
    if (scenarioType === '1:1') {
      availability = availabilityData?.individuals[0]
    } else if (scenarioType === 'X:1') {
      const employeeId = selectedServicesWithEmployees[0]?.selectedEmployees[0]?.id
      availability = availabilityData?.individuals.find(ind => ind.employeeId === employeeId)
    } else if (scenarioType === 'X:X') {
      availability = availabilityData?.individuals.find(
        ind => ind.employeeId === currentEmployee.id && ind.serviceId === currentService.service.id
      )
    }
    
    const dateAvailability = availability?.datesAvailable?.find(
      (dateAvail: DateAvailability) => dateAvail.day.toDateString() === date.toDateString()
    )
    
    setAvailableHours(dateAvailability?.hours || [])
  }

  // Manejar selección de hora
  const handleTimeSelect = (time: string) => {
    if (!currentService || !currentEmployee) return
    
    const currentSelection = getServiceSelection(currentService.service.id, currentEmployee.id)
    setServiceSelection(currentService.service.id, currentEmployee.id, currentSelection?.selectedDate || null, time)
    
    // Mostrar toast de confirmación
    toast.success('Horario seleccionado', {
      description: `${currentService.service.name} con ${currentEmployee.name} - ${currentSelection?.selectedDate?.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })} a las ${time}`
    })
  }

  // Navegar entre servicios/empleados
  const handleNext = () => {
    if (scenarioType === 'X:X') {
      if (currentServiceIndex < selectedServicesWithEmployees.length - 1) {
        setCurrentServiceIndex(currentServiceIndex + 1)
        setCurrentEmployeeIndex(0)
        setAvailableHours([])
      }
    } else if (scenarioType === 'X:1') {
      if (currentServiceIndex < selectedServicesWithEmployees.length - 1) {
        setCurrentServiceIndex(currentServiceIndex + 1)
        setAvailableHours([])
      }
    }
  }

  const handlePrevious = () => {
    if (currentServiceIndex > 0) {
      setCurrentServiceIndex(currentServiceIndex - 1)
      setCurrentEmployeeIndex(0)
      setAvailableHours([])
    }
  }

  // Continuar al siguiente paso
  const handleContinue = () => {
    if (areAllServiceSelectionsComplete()) {
      nextStep()
    }
  }

  const availableDates = getAvailableDates()
  const currentSelection = currentService && currentEmployee ? 
    getServiceSelection(currentService.service.id, currentEmployee.id) : null

  // Renderizar título según el escenario
  const renderTitle = () => {
    if (isUsingSlot) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Horario conjunto seleccionado</h2>
          <p className="text-muted-foreground">
            Todos tus servicios están programados de forma consecutiva
          </p>
          <Button 
            onClick={() => {
              clearSlotSelection()
              setShowSlotSuggestion(true)
            }}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Cambiar a selección individual
          </Button>
        </div>
      )
    }

    if (scenarioType === '1:1') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Selecciona fecha y hora</h2>
          <p className="text-muted-foreground">
            {currentService?.service.name} con {currentEmployee?.name}
          </p>
        </div>
      )
    } else if (scenarioType === 'X:1') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Selecciona fechas y horas</h2>
          <p className="text-muted-foreground">
            Servicio {currentServiceIndex + 1} de {selectedServicesWithEmployees.length}: {currentService?.service.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Con {currentEmployee?.name}
          </p>
        </div>
      )
    } else if (scenarioType === 'X:X') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Selecciona fechas y horas</h2>
          <p className="text-muted-foreground">
            Servicio {currentServiceIndex + 1} de {selectedServicesWithEmployees.length}: {currentService?.service.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Con {currentEmployee?.name}
          </p>
        </div>
      )
    }
  }

  // Renderizar resumen de selecciones
  const renderSelectionSummary = () => {
    if (scenarioType === '1:1') return null
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {isUsingSlot ? 'Horario conjunto programado' : 'Resumen de selecciones'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedServicesWithEmployees.map((item, serviceIndex) =>
              item.selectedEmployees.map((employee, empIndex) => {
                const selection = getServiceSelection(item.service.id, employee.id)
                return (
                  <div key={`${item.service.id}-${employee.id}`} 
                       className={`flex justify-between items-center p-2 rounded ${
                         isUsingSlot ? 'bg-muted/50 border border-border' : 'bg-muted/30'
                       }`}>
                    <div className="flex items-center gap-2">
                      {isUsingSlot && selection?.order && (
                        <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">
                          {selection.order}
                        </Badge>
                      )}
                      <span className="text-sm text-foreground">
                        {item.service.name} - {employee.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {selection?.selectedDate && selection?.selectedTime ? (
                        <span className={isUsingSlot ? 'text-foreground' : 'text-foreground'}>
                          {selection.selectedDate.toLocaleDateString('es-ES')} a las {selection.selectedTime}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pendiente</span>
                      )}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (scenarioType === 'none') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay servicios seleccionados</p>
      </div>
    )
  }

  // Si está usando slot, mostrar solo el resumen
  if (isUsingSlot) {
    return (
      <div className="py-12 space-y-6">
        {renderTitle()}
        {renderSelectionSummary()}
        
        {/* Botones de navegación principal */}
        <div className="flex justify-between items-center pt-6">
          <Button 
            onClick={prevStep} 
            variant="outline"
            size="sm"
          >
            Regresar
          </Button>
          
          <Button 
            onClick={handleContinue}
            size="sm"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 space-y-6">
      {renderTitle()}
      
      {renderSlotSuggestion()}
      
      {renderSelectionSummary()}

      {/* Calendario */}
      <div className="w-full">
        <Calendar
          mode="single"
          selected={currentSelection?.selectedDate || undefined}
          onSelect={handleDateSelect}
          disabled={(date) => {
            return !availableDates.some(availDate => 
              availDate.toDateString() === date.toDateString()
            )
          }}
          className="w-full"
        />
      </div>

      {/* Lista de horarios disponibles */}
      {currentSelection?.selectedDate && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Horarios disponibles para {currentSelection.selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          {availableHours.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableHours.map((hour) => (
                <Button
                  key={hour}
                  variant={currentSelection?.selectedTime === hour ? "default" : "outline"}
                  onClick={() => handleTimeSelect(hour)}
                  className="h-12 text-sm"
                >
                  {hour}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No hay horarios disponibles para esta fecha
            </p>
          )}
        </div>
      )}

      {/* Navegación entre servicios */}
      {(scenarioType === 'X:X' || scenarioType === 'X:1') && (
        <div className="flex justify-between items-center pt-6">
          <Button 
            onClick={handlePrevious}
            variant="outline"
            disabled={currentServiceIndex === 0}
          >
            Servicio anterior
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentServiceIndex + 1} de {selectedServicesWithEmployees.length}
          </span>
          
          <Button 
            onClick={handleNext}
            variant="outline"
            disabled={currentServiceIndex === selectedServicesWithEmployees.length - 1}
          >
            Siguiente servicio
          </Button>
        </div>
      )}

      {/* Botones de navegación principal */}
      <div className="flex justify-between items-center pt-6">
        <Button 
          onClick={prevStep} 
          variant="outline"
          size="sm"
        >
          Regresar
        </Button>
        
        <Button 
          onClick={handleContinue}
          size="sm"
          disabled={!areAllServiceSelectionsComplete()}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}