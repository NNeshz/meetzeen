import { create } from "zustand";

interface EquipoFilters {
  search: string;
  categoryId: string;
  currentPage: number;
  totalPages: number;
}

interface EquipoActions {
  setFilter: <K extends keyof EquipoFilters>(
    key: K,
    value: EquipoFilters[K]
  ) => void;
  setPagination: (currentPage: number, totalPages: number) => void;
  resetFilters: () => void;
}

const initialState: EquipoFilters = {
  search: "",
  categoryId: "",
  currentPage: 1,
  totalPages: 1,
};

export const useEquipoFilters = create<EquipoFilters & EquipoActions>((set) => ({
  ...initialState,

  setFilter: (key, value) => set((state) => ({ [key]: value })),
  
  setPagination: (currentPage: number, totalPages: number) =>
    set((state) => ({
      currentPage: currentPage,
      totalPages: totalPages,
    })),
  
    resetFilters: () => set(initialState),
}));