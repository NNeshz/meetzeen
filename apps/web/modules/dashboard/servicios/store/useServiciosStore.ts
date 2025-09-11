import { create } from "zustand";

interface ServiciosFilters {
  search: string;
  categoryId: string;
  currentPage: number;
  totalPages: number;
}

interface ServiciosActions {
  setFilter: <K extends keyof ServiciosFilters>(
    key: K,
    value: ServiciosFilters[K]
  ) => void;
  setPagination: (currentPage: number, totalPages: number) => void;
  resetFilters: () => void;
}

const initialState: ServiciosFilters = {
  search: "",
  categoryId: "",
  currentPage: 1,
  totalPages: 1,
};

export const useServiciosFilters = create<ServiciosFilters & ServiciosActions>((set) => ({
  ...initialState,

  setFilter: (key, value) => set((state) => ({ [key]: value })),
  
  setPagination: (currentPage: number, totalPages: number) =>
    set((state) => ({
      currentPage: currentPage,
      totalPages: totalPages,
    })),
  
  resetFilters: () => set(initialState),
}));