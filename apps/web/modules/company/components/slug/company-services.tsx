"use client";

import { useCompanyBySlug } from "@/modules/company/hooks/use-company";
import { Badge } from "@meetzeen/ui/components/badge";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconCheck, IconClock, IconPlus } from "@tabler/icons-react";
import { useCompanyServicesStore } from "@/modules/company/store/company-services-store";

function formatPrice(price: string): string {
  const priceNum = parseFloat(price);
  return priceNum.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

function calculateFinalPrice(price: string, discount: number | null): number {
  const priceNum = parseFloat(price);
  if (discount && discount > 0) {
    return priceNum * (1 - discount / 100);
  }
  return priceNum;
}

export function CompanyServices({ slug }: { slug: string }) {
  const { companyData, isGettingCompany, errorGettingCompany } =
    useCompanyBySlug(slug);
  const {
    addService,
    removeService,
    services: selectedServices,
  } = useCompanyServicesStore();

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

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

  const services = companyData?.services || [];

  return (
    <div className="flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter">
            Servicios
          </h2>
          {services.length === 0 && (
            <p className="text-muted-foreground">
              No hay servicios disponibles
            </p>
          )}
          {services.length > 0 && (
            <p className="text-xs md:text-sm max-w-2xl mx-auto text-brand">
              Elige tus servicios, profesional y horario.
            </p>
          )}
        </div>

        {services.length > 0 && (
          <div className="flex flex-col gap-4">
            {services.map((service) => {
              const finalPrice = calculateFinalPrice(
                service.price,
                service.discount
              );

              return (
                <div
                  key={service.id}
                  className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconClock className="h-4 w-4" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    </div>

                    {/* Precio y descuento */}
                    <div className="flex flex-col items-end sm:items-start sm:min-w-[140px]">
                      {service.discount && service.discount > 0 ? (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                              ${formatPrice(finalPrice.toString())}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              -{service.discount}%
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground line-through">
                            ${formatPrice(service.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold">
                          ${formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full mt-4"
                    onClick={() =>
                      isServiceSelected(service.id)
                        ? removeService(service.id)
                        : addService({
                            id: service.id,
                            name: service.name,
                            price: parseFloat(service.price),
                            discount: service.discount || 0,
                            duration: service.duration,
                          })
                    }
                  >
                    {isServiceSelected(service.id) ? (
                      <IconCheck className="size-4" />
                    ) : (
                      <IconPlus className="size-4" />
                    )}
                    {isServiceSelected(service.id)
                      ? "Seleccionado"
                      : "Seleccionar"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
