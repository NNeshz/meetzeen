"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService, type UserProgress } from "../service/progress-service";
import { toast } from "sonner";

// Hook para obtener el progreso del usuario
export const useProgressQuery = () => {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => progressService.getUserProgress(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Hook para actualizar un paso del progreso
export const useUpdateProgressStepMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stepId: number) => progressService.updateProgressStep(stepId),
    
    // Optimistic Update
    onMutate: async (stepId: number) => {
      const queryKey = ["progress"];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<UserProgress>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        const updatedSteps = previousData.steps.map((step) => {
          if (step.id === stepId) {
            return { ...step, completed: true, current: false };
          }
          return step;
        });
        
        const completedSteps = updatedSteps.filter(step => step.completed).length;
        const currentStep = Math.min(completedSteps + 1, updatedSteps.length);
        const progress = (completedSteps / updatedSteps.length) * 100;
        const onboardingCompleted = completedSteps === updatedSteps.length;
        
        // Marcar nuevo paso actual
        updatedSteps.forEach((step, index) => {
          step.current = index + 1 === currentStep && !step.completed;
        });
        
        queryClient.setQueryData<UserProgress>(queryKey, {
          ...previousData,
          currentStep,
          progress,
          steps: updatedSteps,
          onboardingCompleted
        });
      }
      
      return { previousData };
    },
    
    onError: (error, stepId, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData) {
        queryClient.setQueryData(["progress"], context.previousData);
      }
      
      console.error("Error al actualizar paso:", error);
      toast.error("Error al actualizar el progreso", {
        description: "No se pudo actualizar el paso. Inténtalo de nuevo.",
      });
    },
    
    onSuccess: () => {
      toast.success("¡Paso completado!", {
        description: "Tu progreso ha sido actualizado correctamente.",
      });
    },
    
    onSettled: () => {
      // Refrescar datos del servidor
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};

// Hook combinado para facilitar el uso
export const useProgress = () => {
  const progressQuery = useProgressQuery();
  const updateStepMutation = useUpdateProgressStepMutation();
  
  return {
    // Datos del progreso
    data: progressQuery.data,
    isLoading: progressQuery.isLoading,
    isError: progressQuery.isError,
    error: progressQuery.error,
    refetch: progressQuery.refetch,
    
    // Mutación para actualizar pasos
    updateStep: updateStepMutation.mutate,
    isUpdating: updateStepMutation.isPending,
    updateError: updateStepMutation.error,
  };
};