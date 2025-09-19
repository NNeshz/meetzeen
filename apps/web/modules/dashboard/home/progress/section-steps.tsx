"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@meetzeen/ui/components/button";
import {
  IconBuilding,
  IconTags,
  IconUsers,
  IconBriefcase,
  IconChevronRight,
} from "@tabler/icons-react";
import { useProgress } from "./hook/useProgress";

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

  useEffect(() => {
    // No mostrar nada si está cargando
    if (isLoading) return;

    // No mostrar nada si no hay datos
    if (!progressData) return;

    const { progress, onboardingCompleted } = progressData;

    // No mostrar nada si el onboarding está completado o el progreso es 100%
    if (onboardingCompleted || progress >= 100) return;

    // Calcular pasos completados
    const completedSteps = Math.floor((progress / 100) * businessSteps.length);

    // Obtener pasos no completados
    const incompleteSteps = businessSteps.filter((_, index) => index >= completedSteps);

    // No mostrar nada si no hay pasos a seguir
    if (incompleteSteps.length === 0) return;

    // Mostrar toast para cada paso no completado
    incompleteSteps.forEach((step, index) => {
      const StepIcon = step.icon;
      const route = stepRoutes[step.id as keyof typeof stepRoutes];

      // Delay progresivo para que no aparezcan todos al mismo tiempo
      setTimeout(() => {
        toast(step.title, {
          description: step.description,
          icon: <StepIcon className="w-5 h-5" />,
          duration: Infinity, // Toast persistente
          action: route ? {
            label: (
              <div className="flex items-center gap-1">
                Ir
                <IconChevronRight className="w-3 h-3" />
              </div>
            ),
            onClick: () => router.push(route),
          } : undefined,
        });
      }, index * 200); // 200ms de delay entre cada toast
    });

    // Cleanup function para limpiar toasts cuando el componente se desmonte
    return () => {
      toast.dismiss();
    };
  }, [progressData, isLoading, router]);

  // No renderizar nada - solo manejamos toasts
  return null;
}