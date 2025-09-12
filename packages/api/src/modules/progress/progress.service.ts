import { prismaClient } from "@meetzeen/api/src/modules/prisma";

export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface UserProgress {
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: ProgressStep[];
  onboardingCompleted: boolean;
}

export class ProgressService {
  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      // Buscar la organización del usuario
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            include: {
              categories: true,
              employees: true,
              services: true
            }
          }
        }
      });

      // Si el usuario no tiene organización, devolver progreso inicial
      if (!membership) {
        return this.getInitialProgress();
      }

      const org = membership.organization;
      
      // Definir los pasos y verificar completitud
      const steps: ProgressStep[] = [
        {
          id: 1,
          title: "Paso 1",
          description: "Crea tu empresa para comenzar",
          completed: this.isCompanySetupComplete(org)
        },
        {
          id: 2,
          title: "Paso 2", 
          description: "Crea las categorías",
          completed: org.categories.length > 0
        },
        {
          id: 3,
          title: "Paso 3",
          description: "Crea tus primeros empleados",
          completed: org.employees.length > 0
        },
        {
          id: 4,
          title: "Paso 4",
          description: "Completa tus servicios",
          completed: org.services.length > 0
        }
      ];

      // Calcular paso actual
      const completedSteps = steps.filter(step => step.completed).length;
      const currentStep = Math.min(completedSteps + 1, steps.length);
      
      // Marcar paso actual
      steps.forEach((step, index) => {
        step.current = index + 1 === currentStep && !step.completed;
      });

      const progress = (completedSteps / steps.length) * 100;
      const onboardingCompleted = completedSteps === steps.length;

      // Actualizar el estado de onboarding en la base de datos si es necesario
      if (onboardingCompleted && !org.onboardingCompleted) {
        await prismaClient.organization.update({
          where: { id: org.id },
          data: { onboardingCompleted: true }
        });
      }

      return {
        currentStep,
        totalSteps: steps.length,
        progress,
        steps,
        onboardingCompleted
      };
    } catch (error) {
      console.error("Error al obtener progreso del usuario:", error);
      throw error;
    }
  }

  private getInitialProgress(): UserProgress {
    // Progreso inicial para usuarios sin organización
    const steps: ProgressStep[] = [
      {
        id: 1,
        title: "Paso 1",
        description: "Crea tu empresa para comenzar",
        completed: false,
        current: true
      },
      {
        id: 2,
        title: "Paso 2",
        description: "Crea las categorías",
        completed: false
      },
      {
        id: 3,
        title: "Paso 3",
        description: "Crea tus primeros empleados",
        completed: false
      },
      {
        id: 4,
        title: "Paso 4",
        description: "Completa tus servicios",
        completed: false
      }
    ];

    return {
      currentStep: 1,
      totalSteps: steps.length,
      progress: 0,
      steps,
      onboardingCompleted: false
    };
  }

  private isCompanySetupComplete(org: any): boolean {
    // Verificar que los campos básicos estén completos
    return !!(
      org.name && 
      org.phoneNumber && 
      org.address &&
      org.workDays && 
      org.workDays.length > 0 &&
      org.startHour &&
      org.endHour
    );
  }

  async updateProgressStep(userId: string, stepId: number): Promise<void> {
    try {
      // Esta función puede ser usada para marcar manualmente un paso como completado
      // Por ahora, el progreso se calcula automáticamente basado en los datos
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        }
      });

      if (!membership) {
        // Para usuarios sin organización, no hay nada que actualizar manualmente
        // El progreso se actualizará automáticamente cuando creen su organización
        return;
      }

      // Aquí podrías implementar lógica adicional si necesitas
      // marcar pasos específicos como completados manualmente
    } catch (error) {
      console.error("Error al actualizar paso de progreso:", error);
      throw error;
    }
  }
}