"use client";

import { Button } from "@meetzeen/ui/components/button";
import {
  IconBuilding,
  IconTags,
  IconUsers,
  IconBriefcase,
  IconCheck,
  IconChevronRight,
  IconLoader2,
} from "@tabler/icons-react";
import { Card } from "@meetzeen/ui/src/components/card";
import { useProgress } from "./hook/useProgress";
import { cn } from "@meetzeen/ui/src/lib/utils";
import { useRouter } from "next/navigation";

// Mapeo de iconos por paso
const stepIcons = {
  1: IconBuilding,
  2: IconTags,
  3: IconUsers,
  4: IconBriefcase,
};

// Mapeo de rutas por paso
const stepRoutes = {
  1: "/dashboard/negocio",
  2: "/dashboard/categorias",
  3: "/dashboard/equipo",
  4: "/dashboard/servicios",
};

// Datos de los pasos empresariales
const businessSteps = [
  {
    id: 1,
    title: "Configuración de Empresa",
    description: "Configura la información básica de tu negocio.",
    icon: IconBuilding,
  },
  {
    id: 2,
    title: "Categorías",
    description: "Define las categorías de servicios que ofreces.",
    icon: IconTags,
  },
  {
    id: 3,
    title: "Empleados",
    description: "Agrega los miembros de tu equipo de trabajo.",
    icon: IconUsers,
  },
  {
    id: 4,
    title: "Servicios",
    description: "Crea los servicios que ofrece tu empresa.",
    icon: IconBriefcase,
  },
];

export function SectionSteps() {
  const { data: progressData, isLoading } = useProgress();
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <IconLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando progreso...</span>
        </div>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No se pudo cargar el progreso
        </div>
      </Card>
    );
  }

  const { progress, currentStep, onboardingCompleted } = progressData;
  const completedSteps = Math.floor((progress / 100) * businessSteps.length);
  const currentStepData = businessSteps.find(step => step.id === currentStep) || businessSteps[0];
  const CurrentIcon = currentStepData?.icon || IconBuilding;

  const handleContinueClick = () => {
    const route = stepRoutes[currentStep as keyof typeof stepRoutes] || stepRoutes[1];
    router.push(route);
  };

  // Calcular el radio y circunferencia para la barra circular
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Dividir pasos en 2 grupos para desktop
  const firstGroup = businessSteps.slice(0, 2);
  const secondGroup = businessSteps.slice(2, 4);

  // Si el onboarding está completado o el progreso es 100%, no mostrar la card
  if (onboardingCompleted || progress >= 100) {
    return null;
  }

  const renderStepCard = (step: typeof businessSteps[0], index: number) => {
    const isCompleted = index < completedSteps;
    const isCurrent = step.id === currentStep;
    const StepIcon = step.icon;
    
    return (
      <div 
        key={step.id}
        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer group"
        onClick={() => {
          const route = stepRoutes[step.id as keyof typeof stepRoutes];
          if (route) router.push(route);
        }}
      >
        {/* Icono de estado */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isCompleted 
            ? "bg-green-500 text-white" 
            : isCurrent
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}>
          {isCompleted ? (
            <IconCheck className="w-5 h-5" />
          ) : (
            <StepIcon className={cn(
              "w-5 h-5",
              isCurrent && "animate-pulse"
            )} />
          )}
        </div>
        
        {/* Contenido del paso */}
        <div className="flex-1">
          <h3 className={cn(
            "font-medium text-sm",
            isCompleted 
              ? "text-green-600" 
              : isCurrent 
                ? "text-primary" 
                : "text-foreground"
          )}>
            {step.title}
          </h3>
          <p className="text-muted-foreground text-xs mt-1">
            {step.description}
          </p>
        </div>
        
        {/* Flecha */}
        <IconChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    );
  };

  return (
    <Card className="p-6">
      {/* Layout Mobile: Stack vertical */}
      <div className="block md:hidden space-y-6">
        {/* Progreso circular centrado */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Círculo de fondo */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-muted"
              />
              {/* Círculo de progreso */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-500 ease-out"
              />
            </svg>
            
            {/* Icono del paso actual en el centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <CurrentIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Porcentaje */}
          <span className="text-2xl font-bold text-foreground mb-2">
            {Math.round(progress)}%
          </span>
          
          {/* Texto descriptivo */}
          <h2 className="text-xl font-semibold mb-1">
            Configuración Inicial
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Completa estos pasos para comenzar
          </p>
          
          <Button onClick={handleContinueClick} size="sm" variant="default">
            Continuar
            <IconChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {/* Lista de pasos en mobile */}
        <div className="space-y-3">
          {businessSteps.map((step, index) => renderStepCard(step, index))}
        </div>
      </div>

      {/* Layout Desktop: Horizontal con 3 columnas */}
      <div className="hidden md:flex items-start gap-8">
        {/* Columna 1: Progreso circular y texto (1/3) */}
        <div className="w-1/3 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Círculo de fondo */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-muted"
              />
              {/* Círculo de progreso */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-500 ease-out"
              />
            </svg>
            
            {/* Icono del paso actual en el centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <CurrentIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Porcentaje */}
          <span className="text-2xl font-bold text-foreground mb-2">
            {Math.round(progress)}%
          </span>
          
          {/* Texto descriptivo */}
          <h2 className="text-xl font-semibold mb-1">
            Configuración Inicial
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Completa estos pasos para comenzar
          </p>
          
          <Button onClick={handleContinueClick} size="sm" variant="default">
            Continuar
            <IconChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {/* Columna 2: Primeros 2 pasos (1/3) */}
        <div className="w-1/3 space-y-4">
          {firstGroup.map((step, index) => renderStepCard(step, index))}
        </div>
        
        {/* Columna 3: Últimos 2 pasos (1/3) */}
        <div className="w-1/3 space-y-4">
          {secondGroup.map((step, index) => renderStepCard(step, index + 2))}
        </div>
      </div>
    </Card>
  );
}