"use client";

import {
  Star,
  Clock,
  Check,
  Plus,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@meetzeen/ui/src/lib/utils";
import type { ThemeConfig } from "@/modules/customization/components/customization-page";
import { fontMap } from "@/lib/fonts";
import { Button } from "@meetzeen/ui/src/components/button";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { Card } from "@meetzeen/ui/src/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@meetzeen/ui/src/components/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@meetzeen/ui/src/components/collapsible";
import { Calendar } from "@meetzeen/ui/src/components/calendar";
import { useState } from "react";

interface PreviewProps {
  config: ThemeConfig;
}

const roundedMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const alignmentMap: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export function CustomizationPreview({ config }: PreviewProps) {
  const fontStyle = fontMap[config.font as keyof typeof fontMap]?.style || {};
  const roundedClass = roundedMap[config.rounded] || "rounded-md";

  return (
    <div
      className="flex-1 bg-muted/30 min-h-full py-8 px-4 sm:px-6"
      style={fontStyle}
    >
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <PreviewHeader config={config} roundedClass={roundedClass} />
        <PreviewServices config={config} roundedClass={roundedClass} />
        <PreviewEmployees config={config} roundedClass={roundedClass} />
      </div>
    </div>
  );
}

// Mock Data
const MOCK_COMPANY = {
  name: "Studio Elegance",
  slug: "studio-elegance",
  initials: "SE",
  logo: null,
};

const MOCK_SERVICES = [
  {
    id: "1",
    name: "Corte de Cabello Premium",
    description: "Incluye lavado, masaje capilar y peinado.",
    price: 35.0,
    duration: 45,
    discount: 0,
  },
  {
    id: "2",
    name: "Coloración Completa",
    description: "Tinte profesional con productos orgánicos.",
    price: 80.0,
    duration: 120,
    discount: 10,
  },
];

const MOCK_EMPLOYEES = [
  {
    id: "1",
    name: "Ana García",
    role: "Estilista Senior",
    image: "",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    role: "Barbero",
    image: "",
  },
];

function PreviewHeader({
  config,
  roundedClass,
}: {
  config: ThemeConfig;
  roundedClass: string;
}) {
  const alignClass = alignmentMap[config.alignment];
  const isCenter = config.alignment === "center";

  return (
    <div className={cn("flex flex-col justify-center px-4 py-8 bg-background border shadow-sm", roundedClass)}>
      <div className={cn("w-full flex flex-col space-y-6", alignClass)}>
        {/* Logo/Avatar */}
        <div
          className={cn(
            "w-24 h-24 flex items-center justify-center text-white text-3xl font-bold shadow-md",
            roundedClass
          )}
          style={{ backgroundColor: config.primaryColor }}
        >
          {MOCK_COMPANY.initials}
        </div>

        {/* Company Info */}
        <div className={cn("space-y-1", alignClass)}>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter">
            {MOCK_COMPANY.name}
          </h1>
          <p className="text-lg text-muted-foreground">@{MOCK_COMPANY.slug}</p>
        </div>

        {/* Action Buttons */}
        <div className={cn("flex flex-wrap gap-2 w-full", isCenter ? "justify-center" : config.alignment === "right" ? "justify-end" : "justify-start")}>
          <Button
            variant="outline"
            className={cn("gap-2", roundedClass)}
            style={{ borderColor: config.primaryColor, color: config.primaryColor }}
          >
            <MapPin className="h-4 w-4" />
            Información
          </Button>
          <Button
             className={cn("gap-2 text-white", roundedClass)}
             style={{ backgroundColor: config.primaryColor }}
          >
            <Check className="h-4 w-4" />
            Servicios (0)
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewServices({
  config,
  roundedClass,
}: {
  config: ThemeConfig;
  roundedClass: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter">
          Servicios
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Elige tus servicios, profesional y horario.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_SERVICES.map((service) => {
          const isSelected = selected.includes(service.id);
          const finalPrice =
            service.discount > 0
              ? service.price * (1 - service.discount / 100)
              : service.price;

          return (
            <Card
              key={service.id}
              className={cn(
                "p-6 hover:shadow-lg transition-all duration-200 border",
                roundedClass
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                </div>

                <div className="flex flex-col items-end sm:min-w-[100px]">
                  {service.discount > 0 ? (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: config.primaryColor }}>
                          ${finalPrice.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          -{service.discount}%
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground line-through">
                        ${service.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: config.primaryColor }}>
                      ${service.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                className={cn("w-full mt-4 text-white", roundedClass)}
                style={{
                  backgroundColor: isSelected ? config.secondaryColor : config.primaryColor,
                }}
                onClick={() => toggleService(service.id)}
              >
                {isSelected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Seleccionado
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Seleccionar
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PreviewEmployees({
  config,
  roundedClass,
}: {
  config: ThemeConfig;
  roundedClass: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter">
          Profesionales
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Selecciona con quién quieres atenderte.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_EMPLOYEES.map((employee) => {
            const isOpen = openId === employee.id;
            
            return (
                <Card key={employee.id} className={cn("overflow-hidden border", roundedClass)}>
                <Collapsible open={isOpen} onOpenChange={(open) => setOpenId(open ? employee.id : null)}>
                    <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-6 h-auto hover:bg-accent/50"
                    >
                        <div className="flex items-center gap-4 flex-1">
                        <Avatar className={cn("h-12 w-12", roundedClass)}>
                            <AvatarImage src={employee.image} />
                            <AvatarFallback className={roundedClass} style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor }}>
                                {employee.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                        </div>
                        <ChevronDown
                        className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            isOpen ? "rotate-180" : ""
                        )}
                        />
                    </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-6 pt-2">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={cn("border rounded-md p-4 bg-background", roundedClass)}>
                                <div className="text-center text-sm text-muted-foreground mb-4">
                                    <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    Selecciona una fecha
                                </div>
                                {/* Mock Calendar Visual */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-50">
                                    {['D','L','M','X','J','V','S'].map(d => <div key={d} className="font-bold">{d}</div>)}
                                    {Array.from({length: 30}).map((_, i) => (
                                        <div key={i} className={cn("p-2", i === 15 ? "bg-primary text-primary-foreground rounded-full" : "")}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm mb-3">Horarios disponibles</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['09:00', '10:00', '11:30', '14:00', '16:00'].map(time => (
                                        <Button 
                                            key={time} 
                                            variant="outline" 
                                            className={cn("w-full", roundedClass)}
                                            style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                </Card>
            );
        })}
      </div>
    </div>
  );
}
