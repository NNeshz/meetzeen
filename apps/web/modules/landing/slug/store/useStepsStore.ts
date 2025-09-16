import { create } from "zustand"
import { useBookingStore } from "./useBookingStore"

interface StepsStore {
  step: number;
}

interface StepsActions {
  nextStep: () => void;
  prevStep: () => void;
  canProceedToNextStep: () => boolean;
}

export const useStepsStore = create<StepsStore & StepsActions>((set, get) => ({
  step: 1,
  
  nextStep: () => {
    const { canProceedToNextStep } = get();
    if (canProceedToNextStep()) {
      set((state) => ({ step: state.step + 1 }));
    }
  },
  
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  
  canProceedToNextStep: () => {
    const { step } = get();
    
    if (step === 1) {
      const bookingStore = useBookingStore.getState();
      return bookingStore.areAllServicesComplete();
    }
  
    return true;
  },
}))