import { create } from "zustand";

interface SlugStepsStore {
  steps: number;
  nextStep: () => void;
  previousStep: () => void;
}

export const useSlugSteps = create<SlugStepsStore>((set) => ({
  steps: 1,
  nextStep: () =>
    set((state) => ({
      steps: Math.min(state.steps + 1, 3),
    })),
  previousStep: () =>
    set((state) => ({
      steps: Math.max(state.steps - 1, 1),
    })),
}));
