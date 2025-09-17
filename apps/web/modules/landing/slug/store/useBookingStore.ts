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

interface ServiceSlot {
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  order: number;
}

interface SetAvailability {
  day: Date;
  startHour: string;
  endHour: string;
  services?: ServiceSlot[]; // Nueva propiedad para detallar la secuencia
}

interface AvailabilityResponse {
  set?: SetAvailability;
  individuals: IndividualAvailability[];
}

interface ServiceSelection {
  serviceId: string;
  employeeId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedDateTime: Date | null;
  order?: number; // Nueva propiedad para el orden
}

interface BookingState {
  selectedServicesWithEmployees: ServiceWithEmployee[];
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
  selectedDateTime: Date | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  serviceSelections: ServiceSelection[];
  currentStep: number;
  availabilityData: AvailabilityResponse | null;
  isUsingSlot: boolean; // Nueva propiedad para indicar si se está usando un slot
  
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
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setCurrentStep: (step: number) => void;
  setAvailabilityData: (data: AvailabilityResponse) => void;
  
  // Métodos para manejar selecciones por servicio
  setServiceSelection: (serviceId: string, employeeId: string, date: Date | null, time: string | null) => void;
  getServiceSelection: (serviceId: string, employeeId: string) => ServiceSelection | undefined;
  areAllServiceSelectionsComplete: () => boolean;
  
  // Nuevos métodos para manejar slots
  applySlotSelection: (slot: SetAvailability) => void;
  clearSlotSelection: () => void;
  canUseSlot: () => boolean;
  reorderSlotServices: (newOrder: ServiceSlot[]) => void;
  
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
  selectedDate: null,
  selectedTime: null,
  serviceSelections: [],
  currentStep: 0,
  availabilityData: null,
  isUsingSlot: false, // Nuevo estado inicial
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
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setSelectedTime: (time) => set({ selectedTime: time }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setAvailabilityData: (data) => set({ availabilityData: data }),
  
  // Métodos para manejar selecciones por servicio
  setServiceSelection: (serviceId, employeeId, date, time) => set((state) => {
    const existingIndex = state.serviceSelections.findIndex(
      sel => sel.serviceId === serviceId && sel.employeeId === employeeId
    );
    
    let selectedDateTime: Date | null = null;
    if (date && time) {
      const [hours, minutes] = time.split(':').map(Number);
      selectedDateTime = new Date(date);
      if (hours !== undefined && minutes !== undefined) {
        selectedDateTime.setHours(hours, minutes, 0, 0);
      }
    }
    
    const newSelection: ServiceSelection = {
      serviceId,
      employeeId,
      selectedDate: date,
      selectedTime: time,
      selectedDateTime
    };
    
    if (existingIndex >= 0) {
      // Actualizar selección existente
      const updatedSelections = [...state.serviceSelections];
      updatedSelections[existingIndex] = newSelection;
      return { serviceSelections: updatedSelections };
    } else {
      // Agregar nueva selección
      return { serviceSelections: [...state.serviceSelections, newSelection] };
    }
  }),
  
  getServiceSelection: (serviceId, employeeId) => {
    const state = get();
    return state.serviceSelections.find(
      sel => sel.serviceId === serviceId && sel.employeeId === employeeId
    );
  },
  
  areAllServiceSelectionsComplete: () => {
    const state = get();
    const requiredSelections = state.selectedServicesWithEmployees.flatMap(item =>
      item.selectedEmployees.map(emp => ({ serviceId: item.service.id, employeeId: emp.id }))
    );
    
    return requiredSelections.every(required =>
      state.serviceSelections.some(sel =>
        sel.serviceId === required.serviceId &&
        sel.employeeId === required.employeeId &&
        sel.selectedDate &&
        sel.selectedTime
      )
    );
  },
  
  // Nuevos métodos para manejar slots
  applySlotSelection: (slot) => set((state) => {
    if (!slot.services) return state;
    
    const newSelections: ServiceSelection[] = slot.services.map(serviceSlot => {
      const [hours, minutes] = serviceSlot.startTime.split(':').map(Number);
      const selectedDateTime = new Date(slot.day);
      if (hours !== undefined && minutes !== undefined) {
        selectedDateTime.setHours(hours, minutes, 0, 0);
      }
      
      return {
        serviceId: serviceSlot.serviceId,
        employeeId: serviceSlot.employeeId,
        selectedDate: slot.day,
        selectedTime: serviceSlot.startTime,
        selectedDateTime,
        order: serviceSlot.order
      };
    });
    
    return {
      serviceSelections: newSelections,
      isUsingSlot: true,
      selectedDate: slot.day,
      selectedTime: slot.startHour
    };
  }),
  
  clearSlotSelection: () => set((state) => ({
    serviceSelections: [],
    isUsingSlot: false,
    selectedDate: null,
    selectedTime: null
  })),
  
  canUseSlot: () => {
    const state = get();
    return state.availabilityData?.set !== undefined && 
           state.selectedServicesWithEmployees.length > 1;
  },
  
  reorderSlotServices: (newOrder) => set((state) => {
    if (!state.isUsingSlot || !state.availabilityData?.set) return state;
    
    const updatedSelections = state.serviceSelections.map(selection => {
      const newSlot = newOrder.find(slot => 
        slot.serviceId === selection.serviceId && 
        slot.employeeId === selection.employeeId
      );
      
      if (newSlot) {
        const [hours, minutes] = newSlot.startTime.split(':').map(Number);
        const selectedDateTime = new Date(selection.selectedDate!);
        if (hours !== undefined && minutes !== undefined) {
          selectedDateTime.setHours(hours, minutes, 0, 0);
        }
        
        return {
          ...selection,
          selectedTime: newSlot.startTime,
          selectedDateTime,
          order: newSlot.order
        };
      }
      
      return selection;
    });
    
    return { serviceSelections: updatedSelections };
  }),
  
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

export type { Service, Employee, AvailabilityResponse, IndividualAvailability, SetAvailability, DateAvailability, ServiceSelection, ServiceSlot };