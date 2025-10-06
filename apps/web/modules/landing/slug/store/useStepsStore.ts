import { create } from "zustand"
import { useServicesStore } from "./servicesSlice"
import { useScheduleStore } from "./scheduleSlice"
import { useCustomerStore } from "./customerSlice"

interface StepsStore {
  step: number;
}

interface StepsActions {
  nextStep: () => void;
  prevStep: () => void;
  canProceedToNextStep: () => boolean;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const useStepsStore = create<StepsStore & StepsActions>((set, get) => ({
  step: 1,
  
  nextStep: () => {
    const { canProceedToNextStep } = get();
    if (canProceedToNextStep()) {
      set((state) => ({ step: state.step + 1 }));
    }
  },
  
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  goToStep: (step) => set({ step: Math.max(1, Math.min(5, step)) }),
  
  canProceedToNextStep: () => {
    const { step } = get();
    
    if (step === 1) {
      // Paso 1: Servicios - verificar que todos los servicios tengan empleados
      return useServicesStore.getState().areAllServicesComplete();
    }
    
    if (step === 2) {
      // Paso 2: Horarios - verificar que todos los servicios tengan fecha y hora
      return useScheduleStore.getState().areAllServiceSelectionsComplete();
    }
    
    if (step === 3) {
      // Paso 3: Resumen - siempre se puede proceder
      return true;
    }
    
    if (step === 4) {
      // Paso 4: Datos del cliente - verificar que estén completos
      return useCustomerStore.getState().isCustomerDataComplete();
    }
  
    return true;
  },
  
  reset: () => set({ step: 1 }),
}))