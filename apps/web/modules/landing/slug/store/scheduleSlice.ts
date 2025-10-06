import { create } from 'zustand';
import { 
  AvailabilityResponse, 
  ServiceSelection, 
  SetAvailability, 
  ServiceSlot,
  DateAvailability 
} from './types';

interface ScheduleState {
  availabilityData: AvailabilityResponse | null;
  serviceSelections: ServiceSelection[];
  isUsingSlot: boolean;
  
  // Actions
  setAvailabilityData: (data: AvailabilityResponse) => void;
  setServiceSelection: (serviceId: string, employeeId: string, date: Date | null, time: string | null) => void;
  getServiceSelection: (serviceId: string, employeeId: string) => ServiceSelection | undefined;
  areAllServiceSelectionsComplete: () => boolean;
  
  // Slot management
  applySlotSelection: (slot: SetAvailability) => void;
  clearSlotSelection: () => void;
  canUseSlot: () => boolean;
  reorderSlotServices: (newOrder: ServiceSlot[]) => void;
  
  // Data preparation for backend
  getScheduleForBackend: () => {
    isSlotBooking: boolean;
    selections: Array<{
      serviceId: string;
      employeeId: string;
      startDateTime: Date;
      endDateTime: Date;
      order?: number;
    }>;
  };
  
  reset: () => void;
}

const initialState = {
  availabilityData: null,
  serviceSelections: [],
  isUsingSlot: false,
};

// Utility functions
const parseDurationToMinutes = (duration: string): number => {
  if (/^\d+$/.test(duration)) {
    return parseInt(duration);
  }
  
  let totalMinutes = 0;
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)m/);
  
  if (hourMatch?.[1]) totalMinutes += parseInt(hourMatch[1]) * 60;
  if (minuteMatch?.[1]) totalMinutes += parseInt(minuteMatch[1]);
  
  return totalMinutes;
};

const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = (hours || 0) * 60 + (mins || 0) + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  ...initialState,
  
  setAvailabilityData: (data) => set({ availabilityData: data }),
  
  setServiceSelection: (serviceId, employeeId, date, time) => set((state) => {
    const existingIndex = state.serviceSelections.findIndex(
      selection => selection.serviceId === serviceId && selection.employeeId === employeeId
    );
    
    let selectedDateTime: Date | null = null;
    if (date && time) {
      selectedDateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      selectedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    }
    
    const newSelection: ServiceSelection = {
      serviceId,
      employeeId,
      selectedDate: date,
      selectedTime: time,
      selectedDateTime
    };
    
    if (existingIndex >= 0) {
      const updatedSelections = [...state.serviceSelections];
      updatedSelections[existingIndex] = newSelection;
      return { serviceSelections: updatedSelections };
    } else {
      return { serviceSelections: [...state.serviceSelections, newSelection] };
    }
  }),
  
  getServiceSelection: (serviceId, employeeId) => {
    const state = get();
    return state.serviceSelections.find(
      selection => selection.serviceId === serviceId && selection.employeeId === employeeId
    );
  },
  
  areAllServiceSelectionsComplete: () => {
    const state = get();
    // Esta función necesitará acceso a los servicios seleccionados
    // Por ahora, verificamos que todas las selecciones tengan fecha y hora
    return state.serviceSelections.length > 0 && 
           state.serviceSelections.every(selection => 
             selection.selectedDate && selection.selectedTime
           );
  },
  
  applySlotSelection: (slot) => set((state) => {
    if (!slot.services) return state;
    
    const updatedSelections: ServiceSelection[] = [];
    let currentTime = slot.startHour;
    
    slot.services
      .sort((a, b) => a.order - b.order)
      .forEach((serviceSlot, index) => {
        // Aquí necesitaríamos acceso a la duración del servicio
        // Por ahora, asumimos una duración estándar o la calculamos
        const endTime = serviceSlot.endTime || addMinutesToTime(currentTime, 60);
        
        const selectedDateTime = new Date(slot.day);
        const [hours, minutes] = currentTime.split(':').map(Number);
        selectedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
        
        updatedSelections.push({
          serviceId: serviceSlot.serviceId,
          employeeId: serviceSlot.employeeId,
          selectedDate: slot.day,
          selectedTime: currentTime,
          selectedDateTime,
          order: serviceSlot.order
        });
        
        currentTime = endTime;
      });
    
    return {
      serviceSelections: updatedSelections,
      isUsingSlot: true
    };
  }),
  
  clearSlotSelection: () => set({
    serviceSelections: [],
    isUsingSlot: false
  }),
  
  canUseSlot: () => {
    const state = get();
    return !!(state.availabilityData?.set && state.availabilityData.set.services);
  },
  
  reorderSlotServices: (newOrder) => set((state) => {
    if (!state.isUsingSlot || !state.availabilityData?.set) return state;
    
    const slot = state.availabilityData.set;
    let currentTime = slot.startHour;
    
    const updatedSelections = state.serviceSelections.map(selection => {
      const newSlot = newOrder.find(slot => 
        slot.serviceId === selection.serviceId && 
        slot.employeeId === selection.employeeId
      );
      
      if (newSlot) {
        const endTime = addMinutesToTime(currentTime, 60); // Duración estimada
        const selectedDateTime = new Date(selection.selectedDate!);
        const [hours, minutes] = currentTime.split(':').map(Number);
        selectedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
        
        const updatedSelection = {
          ...selection,
          selectedTime: currentTime,
          selectedDateTime,
          order: newSlot.order
        };
        
        currentTime = endTime;
        return updatedSelection;
      }
      
      return selection;
    });
    
    return { serviceSelections: updatedSelections };
  }),
  
  getScheduleForBackend: () => {
    const state = get();
    
    return {
      isSlotBooking: state.isUsingSlot,
      selections: state.serviceSelections
        .filter(selection => selection.selectedDateTime)
        .map(selection => {
          // Calcular endDateTime basado en la duración del servicio
          // Por ahora usamos 60 minutos como default
          const endDateTime = new Date(selection.selectedDateTime!);
          endDateTime.setMinutes(endDateTime.getMinutes() + 60);
          
          return {
            serviceId: selection.serviceId,
            employeeId: selection.employeeId,
            startDateTime: selection.selectedDateTime!,
            endDateTime,
            order: selection.order
          };
        })
    };
  },
  
  reset: () => set(initialState),
}));