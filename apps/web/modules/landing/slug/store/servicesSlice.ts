import { create } from 'zustand';
import { Service, Employee, ServiceWithEmployee } from './types';

interface ServicesState {
  selectedServicesWithEmployees: ServiceWithEmployee[];
  
  // Actions
  addService: (service: Service, availableEmployees: Employee[]) => void;
  removeService: (serviceId: string) => void;
  toggleService: (service: Service, availableEmployees?: Employee[]) => void;
  clearServices: () => void;
  
  addEmployeeToService: (serviceId: string, employee: Employee) => void;
  removeEmployeeFromService: (serviceId: string, employeeId: string) => void;
  toggleEmployeeForService: (serviceId: string, employee: Employee) => void;
  
  // Selectors
  isServiceSelected: (serviceId: string) => boolean;
  isEmployeeSelectedForService: (serviceId: string, employeeId: string) => boolean;
  areAllServicesComplete: () => boolean;
  
  // Data preparation for backend
  getServicesForBackend: () => Array<{
    serviceId: string;
    employeeIds: string[];
    service: Service;
    employees: Employee[];
  }>;
  
  reset: () => void;
}

const initialState = {
  selectedServicesWithEmployees: [],
};

export const useServicesStore = create<ServicesState>((set, get) => ({
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
    const isSelected = state.selectedServicesWithEmployees.some(
      item => item.service.id === service.id
    );
    
    if (isSelected) {
      get().removeService(service.id);
    } else {
      get().addService(service, availableEmployees);
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
      const isEmployeeSelected = serviceItem.selectedEmployees.some(
        emp => emp.id === employee.id
      );
      
      if (isEmployeeSelected) {
        get().removeEmployeeFromService(serviceId, employee.id);
      } else {
        get().addEmployeeToService(serviceId, employee);
      }
    }
  },
  
  isServiceSelected: (serviceId) => {
    const state = get();
    return state.selectedServicesWithEmployees.some(
      item => item.service.id === serviceId
    );
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
  
  getServicesForBackend: () => {
    const state = get();
    return state.selectedServicesWithEmployees.map(item => ({
      serviceId: item.service.id,
      employeeIds: item.selectedEmployees.map(emp => emp.id),
      service: item.service,
      employees: item.selectedEmployees
    }));
  },
  
  reset: () => set(initialState),
}));