"use client";

import { Badge } from "@meetzeen/ui/src/components/badge";
import { Checkbox } from "@meetzeen/ui/src/components/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@meetzeen/ui/src/components/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@meetzeen/ui/src/components/avatar";
import { useServicesQuery, useSlugQuery, useCheckAvailability } from "@/modules/landing/slug/hooks/useSlugs";
import { useBookingStores } from "@/modules/landing/slug/store/useBookingStores";
import { IconClock, IconTag } from "@tabler/icons-react";
import { Label } from "@meetzeen/ui/src/components/label";
import { Button } from "@meetzeen/ui/src/components/button";
import { toast } from "sonner";
import { useEffect } from "react";

interface ApiService {
  id: string;
  service: string;
  duration: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  employees: {
    id: string;
    name: string;
    imageUrl: string | null;
    categories: {
      id: string;
      name: string;
    }[];
  }[];
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: {
    id: string;
    name: string;
  };
}

interface Employee {
  id: string;
  name: string;
  imageUrl: string | null;
  categories: {
    id: string;
    name: string;
  }[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: ApiService[];
}

interface ServicesProps {
  slugName: string;
}

export function Services({ slugName }: ServicesProps) {
  const { data, isLoading, isError } = useServicesQuery(slugName);
  const { data: orgData } = useSlugQuery(slugName);
  const {
    selectedServicesWithEmployees,
    toggleService,
    toggleEmployeeForService,
    isServiceSelected,
    isEmployeeSelectedForService,
    areAllServicesComplete,
    setAvailabilityData,
    setOrganizationId,
    getServicesForBackend,
    nextStep,
  } = useBookingStores();
  
  // Get organization ID from the organization data
  const organizationId = orgData?.data?.id;
  const checkAvailabilityMutation = useCheckAvailability(organizationId || "");

  // Set organization ID when it's available - usando useEffect para evitar bucle infinito
  useEffect(() => {
    if (organizationId) {
      setOrganizationId(organizationId);
    }
  }, [organizationId, setOrganizationId]);

  if (isLoading || isError || !data) {
    return null;
  }

  const apiServices = (data as ApiResponse).data || [];

  if (apiServices.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Servicios</h2>
          <p className="text-muted-foreground">
            No hay servicios disponibles en este momento.
          </p>
        </div>
      </div>
    );
  }

  // Función para formatear duración
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

  // Función para formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Convertir ApiService a Service para el store
  const convertToService = (
    apiService: ApiService,
    index: number
  ): Service => ({
    id: apiService.id, // Usar el ID real del servicio en lugar de category.id-index
    name: apiService.service,
    price: apiService.price,
    duration: apiService.duration,
    category: apiService.category,
  });

  const handleServiceChange = (
    service: Service,
    employees: Employee[],
    checked: boolean
  ) => {
    toggleService(service, employees);
  };

  const handleEmployeeChange = (
    serviceId: string,
    employee: Employee,
    checked: boolean
  ) => {
    toggleEmployeeForService(serviceId, employee);
  };

  // Handle continue button click
  const handleContinue = async () => {
    if (!areAllServicesComplete()) {
      toast.error("Por favor, selecciona al menos un empleado para cada servicio");
      return;
    }

    try {
      const servicesForBackend = getServicesForBackend();
      
      // Flatten the services to create individual entries for each employee
      const flattenedServices = servicesForBackend.flatMap(service => 
        service.employeeIds.map(employeeId => ({
          serviceId: service.serviceId,
          employeeId: employeeId,
        }))
      );
      
      const response = await checkAvailabilityMutation.mutateAsync({
        services: flattenedServices,
      });

      if (response?.data) {
        setAvailabilityData(response.data);
        nextStep();
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error al verificar disponibilidad");
    }
  };

  // Verificar si todos los servicios están completos
  const canContinue = areAllServicesComplete();

  return (
    <div className="py-12 space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Servicios</h2>
        <p className="text-muted-foreground">
          Selecciona los servicios que necesitas y sus empleados
        </p>
      </div>

      <div className="space-y-4">
        {apiServices.map((apiService, index) => {
          const service = convertToService(apiService, index);
          const serviceSelected = isServiceSelected(service.id);

          return (
            <div key={service.id} className="space-y-2">
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={service.id}
                    checked={serviceSelected}
                    onCheckedChange={(checked) =>
                      handleServiceChange(
                        service,
                        apiService.employees,
                        checked as boolean
                      )
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={service.id}
                      className="text-lg font-medium cursor-pointer"
                    >
                      {apiService.service}
                    </Label>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <IconTag size={16} />
                        {formatPrice(apiService.price)}
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock size={16} />
                        {formatDuration(apiService.duration)}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {apiService.category.name}
                </Badge>
              </div>

              {/* Accordion que aparece cuando el servicio está seleccionado */}
              {serviceSelected && (
                <div className="ml-6 border-l-2 border-border pl-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`empleados-${service.id}`}>
                      <AccordionTrigger className="text-sm">
                        Seleccionar Empleados ({apiService.employees.length}{" "}
                        disponibles)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {apiService.employees.map((employee) => (
                            <div
                              key={employee.id}
                              className="flex items-center space-x-3 p-3 rounded-lg border bg-card"
                            >
                              <Checkbox
                                id={employee.id}
                                checked={isEmployeeSelectedForService(
                                  service.id,
                                  employee.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleEmployeeChange(
                                    service.id,
                                    employee,
                                    checked as boolean
                                  )
                                }
                              />
                              <Avatar className="h-10 w-10">
                                <AvatarImage 
                                  src={employee.imageUrl || undefined} 
                                  alt={employee.name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <Label
                                  htmlFor={employee.id}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {employee.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Especialidades:{" "}
                                  {employee.categories
                                    .map((cat) => cat.name)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedServicesWithEmployees.length > 0 && !canContinue && (
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            Asigna al menos un empleado a cada servicio seleccionado para continuar
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleContinue} 
        className="w-full" 
        size={"sm"}
        disabled={!canContinue || checkAvailabilityMutation.isPending}
      >
        {checkAvailabilityMutation.isPending ? "Verificando disponibilidad..." : "Continuar"}
      </Button>
    </div>
  );
}