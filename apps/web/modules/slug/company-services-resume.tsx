"use client";

import { useState } from "react";
import { useCompanyServicesStore } from "@/modules/slug/store/service-store";
import { IconClock, IconShoppingCart } from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { Badge } from "@meetzeen/ui/components/badge";

function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", {
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

function calculateFinalPrice(price: number, discount: number): number {
  if (discount && discount > 0) {
    return price * (1 - discount / 100);
  }
  return price;
}

export function CompanyServicesResume() {
  const { services } = useCompanyServicesStore();
  const [open, setOpen] = useState(false);

  // Calcular totales
  const totalOriginalPrice = services.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const totalFinalPrice = services.reduce(
    (sum, service) =>
      sum + calculateFinalPrice(service.price, service.discount),
    0
  );

  const totalDiscount = totalOriginalPrice - totalFinalPrice;
  const totalDiscountPercentage =
    totalOriginalPrice > 0
      ? ((totalDiscount / totalOriginalPrice) * 100).toFixed(1)
      : 0;

  const totalDuration = services.reduce(
    (sum, service) => sum + service.duration,
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <IconShoppingCart className="size-4" />
          Carrito
          {services.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {services.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Resumen de servicios</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          {/* Lista de servicios */}
          <div className="space-y-2 mb-6">
            {services.map((service) => {
              const finalPrice = calculateFinalPrice(
                service.price,
                service.discount
              );

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <IconClock className="h-3 w-3" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {service.discount > 0 ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-semibold">
                          ${formatPrice(finalPrice)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${formatPrice(service.price)}
                        </span>
                        <span className="text-xs text-green-600">
                          -{service.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        ${formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totales */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="line-through text-muted-foreground">
                ${formatPrice(totalOriginalPrice)}
              </span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Descuento:</span>
                <span className="text-green-600 font-semibold">
                  -${formatPrice(totalDiscount)} ({totalDiscountPercentage}%)
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${formatPrice(totalFinalPrice)}</span>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconClock className="h-4 w-4" />
                <span>Tiempo total:</span>
              </div>
              <span className="font-semibold">
                {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
