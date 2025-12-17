import { create } from "zustand";

interface SlugStepsStore {
  steps: number;
  nextStep: () => void;
  previousStep: () => void;
}

export const useSlugSteps = create<SlugStepsStore>((set) => ({
  steps: 1,
  nextStep: () => set((state) => ({ steps: state.steps + 1 })),
  previousStep: () => set((state) => ({ steps: state.steps - 1 })),
}));
