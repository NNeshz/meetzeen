import { create } from "zustand";

interface MetricsStore {
  page: "overview" | "charts";
  setPage: (page: "overview" | "charts") => void;
}

export const useMetricsStore = create<MetricsStore>((set) => ({
  page: "overview",
  setPage: (page) => set({ page }),
}));
