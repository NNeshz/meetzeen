"use client"

import { Badge } from "@meetzeen/ui/src/components/badge";
import { Button } from "@meetzeen/ui/src/components/button";
import { useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs"
import { useBookingStore } from "@/modules/landing/slug/store/useBookingStore";
import { IconClock, IconTag, IconCheck } from "@tabler/icons-react"

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

interface Organization {
  services: Service[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: Organization;
}

interface ServicesProps {
  slugName: string;
  selectable?: boolean;
}

export function Services({ slugName, selectable = false }: ServicesProps) {
  const { data, isLoading, isError } = useSlugQuery(slugName)
  const { selectedServices, toggleService } = useBookingStore();
  
  if (isLoading || isError || !data) {
    return null;
  }

  const organization = (data as ApiResponse).data;
  const services = organization.services || [];

  if (services.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Servicios</h2>
          <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
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
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Servicios</h2>
        <p className="text-muted-foreground">
          {selectable ? "Selecciona los servicios que necesitas" : "Nuestros servicios disponibles"}
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => {
          const selected = isSelected(service.id);
          
          return (
            <div 
              key={service.id} 
              className={`bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 relative ${
                selectable ? 'cursor-pointer' : ''
              } ${
                selected ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={selectable ? () => toggleService(service) : undefined}
            >
              {/* Badge de categoría en esquina superior derecha */}
              <Badge variant="outline" className="absolute top-4 right-4 flex items-center space-x-1">
                <IconTag className="w-3 h-3" />
                <span className="text-xs">{service.category.name}</span>
              </Badge>
              
              {/* Indicador de selección */}
              {selectable && selected && (
                <div className="absolute top-4 left-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start pr-20 pl-8">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-card-foreground mb-2">
                    {service.name}
                  </h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <IconClock className="w-4 h-4" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-foreground">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectable && (
                  <Button
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleService(service);
                    }}
                    className="ml-4"
                  >
                    {selected ? "Seleccionado" : "Seleccionar"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}