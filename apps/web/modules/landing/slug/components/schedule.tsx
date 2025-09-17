'use client'

import { useState } from 'react'
import { Calendar } from '@meetzeen/ui/components/calendar'
import { Button } from '@meetzeen/ui/components/button'
import { useBookingStore, type DateAvailability } from '../store/useBookingStore'
import { useStepsStore } from '../store/useStepsStore'

export function Schedule() {
  const { 
    availabilityData, 
    selectedDate, 
    selectedTime,
    setSelectedDate, 
    setSelectedTime,
    setSelectedDateTime 
  } = useBookingStore()
  const { nextStep, prevStep } = useStepsStore()
  
  const [availableHours, setAvailableHours] = useState<string[]>([])

  const getAvailableDates = (): Date[] => {
    if (!availabilityData?.individuals?.[0]?.datesAvailable) {
      return []
    }
    
    return availabilityData.individuals[0].datesAvailable.map((dateAvail: DateAvailability) => dateAvail.day)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    
    setSelectedDate(date)
    setSelectedTime(null)
    
    const dateAvailability = availabilityData?.individuals?.[0]?.datesAvailable?.find(
      (dateAvail: DateAvailability) => dateAvail.day.toDateString() === date.toDateString()
    )
    
    setAvailableHours(dateAvailability?.hours || [])
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number)
      const fullDateTime = new Date(selectedDate)
      
      if (hours !== undefined && minutes !== undefined) {
        fullDateTime.setHours(hours, minutes, 0, 0)
        setSelectedDateTime(fullDateTime)
      }
    }
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      nextStep()
    }
  }

  const availableDates = getAvailableDates()

  return (
    <div className="py-12 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Selecciona fecha y hora</h2>
        <p className="text-muted-foreground">Elige el día y horario que mejor te convenga</p>
      </div>

      <div className="w-full">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          disabled={(date) => {
            return !availableDates.some(availDate => 
              availDate.toDateString() === date.toDateString()
            )
          }}
          className="w-full"
        />
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Horarios disponibles para {selectedDate.toLocaleDateString('es-ES', {
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
                  variant={selectedTime === hour ? "default" : "outline"}
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


      {selectedDate && selectedTime && (
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
      )}

      {selectedDate && selectedTime && (
        <div className="p-4">
          <p>
            <strong>Fecha y hora seleccionada:</strong> {' '}
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} a las {selectedTime}
          </p>
        </div>
      )}
    </div>
  )
}