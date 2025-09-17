'use client'

import { useState } from 'react'
import { Calendar } from '@meetzeen/ui/components/calendar'
import { Button } from '@meetzeen/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@meetzeen/ui/components/card'
import { useBookingStore, type DateAvailability } from '../store/useBookingStore'
import { useStepsStore } from '../store/useStepsStore'

export function Schedule() {
  const { 
    availabilityData,
    selectedServicesWithEmployees,
    setServiceSelection,
    getServiceSelection,
    areAllServiceSelectionsComplete
  } = useBookingStore()
  const { nextStep, prevStep } = useStepsStore()
  
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0)
  const [availableHours, setAvailableHours] = useState<string[]>([])

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
          <CardTitle className="text-lg">Resumen de selecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedServicesWithEmployees.map((item, serviceIndex) =>
              item.selectedEmployees.map((employee, empIndex) => {
                const selection = getServiceSelection(item.service.id, employee.id)
                return (
                  <div key={`${item.service.id}-${employee.id}`} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      {item.service.name} - {employee.name}
                    </span>
                    <span className="text-sm font-medium">
                      {selection?.selectedDate && selection?.selectedTime ? (
                        `${selection.selectedDate.toLocaleDateString('es-ES')} a las ${selection.selectedTime}`
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

  return (
    <div className="py-12 space-y-6">
      {renderTitle()}
      
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
            <p className="text-center py-8">
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

      {/* Información de selección actual */}
      {currentSelection?.selectedDate && currentSelection?.selectedTime && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            <strong>Selección actual:</strong> {' '}
            {currentService?.service.name} con {currentEmployee?.name} - {' '}
            {currentSelection.selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} a las {currentSelection.selectedTime}
          </p>
        </div>
      )}
    </div>
  )
}