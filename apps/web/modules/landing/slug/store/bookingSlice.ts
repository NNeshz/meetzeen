import { create } from 'zustand';
import { useServicesStore } from './servicesSlice';
import { useScheduleStore } from './scheduleSlice';
import { useCustomerStore } from './customerSlice';
import { BookingPayload, AppointmentData } from './types';

interface BookingState {
  organizationId: string | null;
  
  // Actions
  setOrganizationId: (id: string) => void;
  
  // Data preparation for backend
  prepareBookingPayload: () => BookingPayload | null;
  calculateTotalDuration: () => number;
  calculateTotalPrice: () => number;
  
  // Validation
  canProceedToBooking: () => boolean;
  getBookingValidationErrors: () => string[];
  
  // Reset all stores
  resetAllStores: () => void;
}

const initialState = {
  organizationId: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,
  
  setOrganizationId: (id) => set({ organizationId: id }),
  
  prepareBookingPayload: () => {
    const state = get();
    
    if (!state.organizationId) {
      console.error('Organization ID is required');
      return null;
    }
    
    const servicesData = useServicesStore.getState().getServicesForBackend();
    const scheduleData = useScheduleStore.getState().getScheduleForBackend();
    const customerData = useCustomerStore.getState().getCustomerForBackend();
    
    if (servicesData.length === 0 || scheduleData.selections.length === 0) {
      console.error('Services and schedule data are required');
      return null;
    }
    
    // Calcular fecha de inicio y duración total
    const earliestSelection = scheduleData.selections
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())[0];
    
    const latestSelection = scheduleData.selections
      .sort((a, b) => b.endDateTime.getTime() - a.endDateTime.getTime())[0];
    
    const totalDuration = Math.round(
      (latestSelection?.endDateTime.getTime() || 0) - (earliestSelection?.startDateTime.getTime() || 0)
    ) / (1000 * 60);
    
    const payload: BookingPayload = {
      appointment: {
        organizationId: state.organizationId,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        date: earliestSelection?.startDateTime.toISOString() || '',
        duration: totalDuration,
        status: 'pending' as const,
      },
      slots: scheduleData.selections.map(selection => ({
        employeeId: selection.employeeId,
        serviceId: selection.serviceId,
        startTime: selection.startDateTime.toISOString(),
        endTime: selection.endDateTime.toISOString(),
      }))
    };
    
    return payload;
  },
  
  calculateTotalDuration: () => {
    const servicesData = useServicesStore.getState().getServicesForBackend();
    
    return servicesData.reduce((total, serviceData) => {
      const serviceDuration = serviceData.service.duration;
      
      // Parse duration string to minutes
      if (/^\d+$/.test(serviceDuration)) {
        return total + parseInt(serviceDuration) * serviceData.employeeIds.length;
      }
      
      let minutes = 0;
      const hourMatch = serviceDuration.match(/(\d+)h/);
      const minuteMatch = serviceDuration.match(/(\d+)m/);
      
      if (hourMatch) minutes += parseInt(hourMatch[1] || '0') * 60;
      if (minuteMatch) minutes += parseInt(minuteMatch[1] || '0');
      
      return total + minutes * serviceData.employeeIds.length;
    }, 0);
  },
  
  calculateTotalPrice: () => {
    const servicesData = useServicesStore.getState().getServicesForBackend();
    
    return servicesData.reduce((total, serviceData) => {
      return total + serviceData.service.price * serviceData.employeeIds.length;
    }, 0);
  },
  
  canProceedToBooking: () => {
    const servicesComplete = useServicesStore.getState().areAllServicesComplete();
    const scheduleComplete = useScheduleStore.getState().areAllServiceSelectionsComplete();
    const customerComplete = useCustomerStore.getState().isCustomerDataComplete();
    
    return servicesComplete && scheduleComplete && customerComplete;
  },
  
  getBookingValidationErrors: () => {
    const errors: string[] = [];
    
    if (!useServicesStore.getState().areAllServicesComplete()) {
      errors.push('Debes seleccionar al menos un servicio con empleado');
    }
    
    if (!useScheduleStore.getState().areAllServiceSelectionsComplete()) {
      errors.push('Debes seleccionar fecha y hora para todos los servicios');
    }
    
    if (!useCustomerStore.getState().isCustomerDataComplete()) {
      errors.push('Debes completar todos los datos del cliente');
    }
    
    const customerErrors = useCustomerStore.getState().getCustomerDataErrors();
    if (Object.keys(customerErrors).length > 0) {
      errors.push('Hay errores en los datos del cliente');
    }
    
    return errors;
  },
  
  resetAllStores: () => {
    useServicesStore.getState().reset();
    useScheduleStore.getState().reset();
    useCustomerStore.getState().reset();
    set(initialState);
  },
}));