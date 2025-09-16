import { create } from 'zustand'

interface Employee {
  id: string;
  name: string;
  imageUrl: string | null;
  categories: {
    id: string;
    name: string;
  }[];
}

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

interface ServiceWithEmployee {
  service: Service;
  selectedEmployees: Employee[];
  availableEmployees: Employee[];
}

// Interfaces para la respuesta de disponibilidad
interface DateAvailability {
  day: Date;
  hours: string[];
}

interface IndividualAvailability {
  employeeId: string;
  serviceId: string;
  datesAvailable: DateAvailability[];
}

interface SetAvailability {
  day: Date;
  startHour: string;
  endHour: string;
}

interface AvailabilityResponse {
  set?: SetAvailability;
  individuals: IndividualAvailability[];
}

interface BookingState {
  selectedServicesWithEmployees: ServiceWithEmployee[];
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
  selectedDateTime: Date | null;
  currentStep: number;
  availabilityData: AvailabilityResponse | null;
  
  addService: (service: Service, availableEmployees: Employee[]) => void;
  removeService: (serviceId: string) => void;
  toggleService: (service: Service, availableEmployees?: Employee[]) => void;
  clearServices: () => void;
  
  addEmployeeToService: (serviceId: string, employee: Employee) => void;
  removeEmployeeFromService: (serviceId: string, employeeId: string) => void;
  toggleEmployeeForService: (serviceId: string, employee: Employee) => void;
  
  isServiceSelected: (serviceId: string) => boolean;
  isEmployeeSelectedForService: (serviceId: string, employeeId: string) => boolean;
  areAllServicesComplete: () => boolean;
  
  setCustomerData: (data: Partial<BookingState['customerData']>) => void;
  setSelectedDateTime: (date: Date | null) => void;
  setCurrentStep: (step: number) => void;
  setAvailabilityData: (data: AvailabilityResponse) => void;
  
  getAvailabilityData: () => {
    services: Array<{
      id: string;
      duration: string;
      name?: string;
      categoryId: string;
      employeeIds: string[];
    }>;
  };
  
  reset: () => void;
}

const initialState = {
  selectedServicesWithEmployees: [],
  customerData: {
    name: '',
    email: '',
    phone: '',
  },
  selectedDateTime: null,
  currentStep: 0,
  availabilityData: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,
  
  addService: (service, availableEmployees = []) => set((state) => ({
    selectedServicesWithEmployees: [...state.selectedServicesWithEmployees, {
      service,
      selectedEmployees: [],
      availableEmployees
    }]
  })),
  
  removeService: (serviceId) => set((state) => ({
    selectedServicesWithEmployees: state.selectedServicesWithEmployees.filter(
      item => item.service.id !== serviceId
    )
  })),
  
  toggleService: (service, availableEmployees = []) => {
    const state = get();
    const exists = state.selectedServicesWithEmployees.find(
      item => item.service.id === service.id
    );
    if (exists) {
      state.removeService(service.id);
    } else {
      state.addService(service, availableEmployees);
    }
  },
  
  clearServices: () => set({ selectedServicesWithEmployees: [] }),
  
  addEmployeeToService: (serviceId, employee) => set((state) => ({
    selectedServicesWithEmployees: state.selectedServicesWithEmployees.map(item =>
      item.service.id === serviceId
        ? { ...item, selectedEmployees: [...item.selectedEmployees, employee] }
        : item
    )
  })),
  
  removeEmployeeFromService: (serviceId, employeeId) => set((state) => ({
    selectedServicesWithEmployees: state.selectedServicesWithEmployees.map(item =>
      item.service.id === serviceId
        ? { 
            ...item, 
            selectedEmployees: item.selectedEmployees.filter(emp => emp.id !== employeeId) 
          }
        : item
    )
  })),
  
  toggleEmployeeForService: (serviceId, employee) => {
    const state = get();
    const serviceItem = state.selectedServicesWithEmployees.find(
      item => item.service.id === serviceId
    );
    
    if (serviceItem) {
      const isSelected = serviceItem.selectedEmployees.some(emp => emp.id === employee.id);
      if (isSelected) {
        state.removeEmployeeFromService(serviceId, employee.id);
      } else {
        state.addEmployeeToService(serviceId, employee);
      }
    }
  },
  
  isServiceSelected: (serviceId) => {
    const state = get();
    return state.selectedServicesWithEmployees.some(item => item.service.id === serviceId);
  },
  
  isEmployeeSelectedForService: (serviceId, employeeId) => {
    const state = get();
    const serviceItem = state.selectedServicesWithEmployees.find(
      item => item.service.id === serviceId
    );
    return serviceItem?.selectedEmployees.some(emp => emp.id === employeeId) || false;
  },
  
  areAllServicesComplete: () => {
    const state = get();
    return state.selectedServicesWithEmployees.length > 0 && 
           state.selectedServicesWithEmployees.every(item => item.selectedEmployees.length > 0);
  },
  
  setCustomerData: (data) => set((state) => ({
    customerData: { ...state.customerData, ...data }
  })),
  
  setSelectedDateTime: (date) => set({ selectedDateTime: date }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setAvailabilityData: (data) => set({ availabilityData: data }),
  
  getAvailabilityData: () => {
    const state = get();
    return {
      services: state.selectedServicesWithEmployees.map(item => ({
        id: item.service.id,
        duration: item.service.duration,
        name: item.service.name,
        categoryId: item.service.category.id,
        employeeIds: item.selectedEmployees.map(emp => emp.id)
      }))
    };
  },
  
  reset: () => set(initialState),
  
  selectedServices: [],
}));

export type { Service, Employee, AvailabilityResponse, IndividualAvailability, SetAvailability, DateAvailability };