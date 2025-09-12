"use client"

import { Badge } from "@meetzeen/ui/src/components/badge";
import { useSlugQuery } from "../hooks/useSlugs"
import { IconClock, IconCurrencyDollar, IconTag } from "@tabler/icons-react"

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

export function Services({ slugName }: { slugName: string }) {
  const { data, isLoading, isError } = useSlugQuery(slugName)
  
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

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Servicios</h2>
        <p className="text-muted-foreground">Selecciona los servicios que necesitas</p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 relative"
          >
            {/* Badge de categoría en esquina superior derecha */}
            <Badge variant="outline" className="absolute top-4 right-4 flex items-center space-x-1">
              <IconTag className="w-3 h-3" />
              <span className="text-xs">{service.category.name}</span>
            </Badge>
            
            <div className="flex justify-between items-start pr-20">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}