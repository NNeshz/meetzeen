"use client";

import { useState } from "react";
import { useCompanyBySlug, useAvailability } from "@/modules/slug/hooks/use-slugs";
import { useCompanyServicesStore } from "@/modules/slug/store/service-store";
import { Avatar, AvatarImage, AvatarFallback } from "@meetzeen/ui/components/avatar";
import { Card } from "@meetzeen/ui/components/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@meetzeen/ui/components/collapsible";
import { Calendar } from "@meetzeen/ui/components/calendar";
import { Button } from "@meetzeen/ui/components/button";
import { IconChevronDown } from "@tabler/icons-react";

function getInitialsFromName(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  if (words.length === 1) {
    return words[0]?.charAt(0).toUpperCase() ?? "";
  }

  const first = words[0]?.charAt(0) ?? "";
  const second = words[1]?.charAt(0) ?? "";
  return (first + second).toUpperCase();
}

// Extrae las fechas disponibles de la disponibilidad del empleado
function getAvailableDates(availability: Array<Record<string, string[]>>): Date[] {
  const dates: Date[] = [];
  
  availability.forEach((dayAvailability) => {
    const dateKey = Object.keys(dayAvailability)[0];
    if (!dateKey) return;
    
    const dateStr = dateKey.replace("Date:", "");
    const date = new Date(dateStr + "T00:00:00");
    if (!isNaN(date.getTime())) {
      dates.push(date);
    }
  });
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

// Obtiene los horarios para una fecha específica
function getTimeSlotsForDate(
  availability: Array<Record<string, string[]>>,
  selectedDate: Date | undefined
): string[] {
  if (!selectedDate) return [];
  
  const dateStr = selectedDate.toISOString().split("T")[0];
  const dateKey = `Date:${dateStr}`;
  
  const dayAvailability = availability.find((day) => day[dateKey]);
  if (!dayAvailability) return [];
  
  return dayAvailability[dateKey] || [];
}

export function CompanyEmployees({ slug }: { slug: string }) {
  const { companyData, isGettingCompany, errorGettingCompany } =
    useCompanyBySlug(slug);
  const { services: selectedServices } = useCompanyServicesStore();

  const companyId = companyData?.company?.id;
  const serviceIds = selectedServices.map((service) => service.id);

  const {
    availabilityData,
    isLoadingAvailability,
    errorAvailability,
  } = useAvailability(companyId, serviceIds);

  if (isGettingCompany) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (errorGettingCompany) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{errorGettingCompany.message}</p>
        </div>
      </div>
    );
  }

  if (selectedServices.length === 0) {
    return (
      <div className="flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            Por favor, selecciona al menos un servicio para ver la disponibilidad
            de los empleados.
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingAvailability) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  if (errorAvailability) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{errorAvailability.message}</p>
        </div>
      </div>
    );
  }

  const employees = availabilityData || [];

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            No hay empleados disponibles para los servicios seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter">
            Empleados y Disponibilidad
          </h2>
          <p className="text-xs md:text-sm max-w-2xl mx-auto text-brand mt-2">
            Selecciona un empleado y horario disponible.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {employees.map((employee) => {
            const { info, availability } = employee;
            const hasAvailability = availability.length > 0;
            const availableDates = getAvailableDates(availability);
            
            return (
              <EmployeeCard
                key={info.memberId}
                employee={info}
                availability={availability}
                availableDates={availableDates}
                hasAvailability={hasAvailability}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface EmployeeCardProps {
  employee: {
    memberId: string;
    name: string;
    imageUrl: string;
  };
  availability: Array<Record<string, string[]>>;
  availableDates: Date[];
  hasAvailability: boolean;
}

function EmployeeCard({
  employee,
  availability,
  availableDates,
  hasAvailability,
}: EmployeeCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const timeSlots = getTimeSlotsForDate(availability, selectedDate);

  // Resetear fecha seleccionada cuando se cierra el desplegable
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedDate(undefined);
    }
  };

  // Función para deshabilitar fechas que no están disponibles
  const isDateDisabled = (date: Date): boolean => {
    // Deshabilitar fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    
    // Deshabilitar fechas que no están en availableDates
    const dateStr = date.toISOString().split("T")[0];
    return !availableDates.some(
      (availableDate) => availableDate.toISOString().split("T")[0] === dateStr
    );
  };

  return (
    <Card className="bg-card border rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-6 hover:bg-accent/50"
          >
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback>
                  {getInitialsFromName(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                {!hasAvailability && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No hay disponibilidad en este momento
                  </p>
                )}
              </div>
            </div>
            <IconChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        {hasAvailability && (
          <CollapsibleContent className="px-6 pb-6">
            <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6 mt-4">
              {/* Calendario */}
              <div className="w-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-md border w-full"
                  showOutsideDays={false}
                />
              </div>

              {/* Horarios */}
              {selectedDate && timeSlots.length > 0 && (
                <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
                  {timeSlots.map((time, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-center py-3 text-base hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </Card>
  );
}