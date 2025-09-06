import { create } from "zustand";

interface CategoriesFilters {
  search: string;

  currentPage: number;
  totalPages: number;
}

interface CategoriesActions {
  setFilter: <K extends keyof CategoriesFilters>(
    key: K,
    value: CategoriesFilters[K]
  ) => void;
  setPagination: (currentPage: number, totalPages: number) => void;
  resetFilters: () => void;
}

const initialState: CategoriesFilters = {
  search: "",
  currentPage: 1,
  totalPages: 1,
};

export const useCategoriesFilters = create<CategoriesFilters & CategoriesActions>((set) => ({
  ...initialState,

  setFilter: (key, value) => set((state) => ({ [key]: value })),
  
  setPagination: (currentPage: number, totalPages: number) =>
    set((state) => ({
      currentPage: currentPage,
      totalPages: totalPages,
    })),
  
    resetFilters: () => set(initialState),
}));