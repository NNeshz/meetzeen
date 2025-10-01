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
  
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  canProceedToNextStep: () => {
    const { step } = get();
    const bookingStore = useBookingStore.getState();
    
    if (step === 1) {
      return bookingStore.areAllServicesComplete();
    }
    
    if (step === 2) {
      return bookingStore.areAllServiceSelectionsComplete();
    }
    
    if (step === 4) {
      return bookingStore.otpData.isOtpVerified;
    }
  
    return true;
  },
}))