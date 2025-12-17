import { create } from "zustand";

export interface Service {
  id: string;
  name: string;
  price: number;
  discount: number;
  duration: number;
}

export interface CompanyServicesStore {
  services: Service[];
  addService: (service: Service) => void;
  removeService: (id: string) => void;
  clearServices: () => void;
}

export const useCompanyServicesStore = create<CompanyServicesStore>((set) => ({
  services: [],
  addService: (service) =>
    set((state) => ({ services: [...state.services, service] })),
  removeService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
  clearServices: () => set({ services: [] }),
}));
