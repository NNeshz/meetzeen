import { create } from 'zustand'

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: {
    id: string;
    name: string;
  };
}

interface BookingState {
  // Servicios seleccionados
  selectedServices: Service[];
  // Datos del cliente
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
  // Fecha y hora seleccionada
  selectedDateTime: Date | null;
  // Paso actual
  currentStep: number;
  
  // Acciones
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  toggleService: (service: Service) => void;
  clearServices: () => void;
  
  setCustomerData: (data: Partial<BookingState['customerData']>) => void;
  setSelectedDateTime: (date: Date | null) => void;
  setCurrentStep: (step: number) => void;
  
  // Datos para useCheckAvailability
  getAvailabilityData: () => {
    services: Array<{
      id: string;
      duration: string;
      name?: string;
      categoryId: string;
    }>;
  };
  
  // Reset completo
  reset: () => void;
}

const initialState = {
  selectedServices: [],
  customerData: {
    name: '',
    email: '',
    phone: '',
  },
  selectedDateTime: null,
  currentStep: 0,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,
  
  addService: (service) => set((state) => ({
    selectedServices: [...state.selectedServices, service]
  })),
  
  removeService: (serviceId) => set((state) => ({
    selectedServices: state.selectedServices.filter(s => s.id !== serviceId)
  })),
  
  toggleService: (service) => {
    const state = get();
    const exists = state.selectedServices.find(s => s.id === service.id);
    if (exists) {
      state.removeService(service.id);
    } else {
      state.addService(service);
    }
  },
  
  clearServices: () => set({ selectedServices: [] }),
  
  setCustomerData: (data) => set((state) => ({
    customerData: { ...state.customerData, ...data }
  })),
  
  setSelectedDateTime: (date) => set({ selectedDateTime: date }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  getAvailabilityData: () => {
    const state = get();
    return {
      services: state.selectedServices.map(service => ({
        id: service.id,
        duration: service.duration,
        name: service.name,
        categoryId: service.category.id
      }))
    };
  },
  
  reset: () => set(initialState),
}));