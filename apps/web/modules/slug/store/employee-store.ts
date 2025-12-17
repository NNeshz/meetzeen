import { create } from 'zustand';

interface EmployeeSelectionStore {
  selectedDate: Date | undefined;
  selectedEmployeeId: string | undefined;
  selectedEmployeeName: string | undefined;
  selectedTimeSlot: string | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedEmployee: (employeeId: string | undefined, employeeName?: string | undefined) => void;
  setSelectedTimeSlot: (timeSlot: string | undefined) => void;
  clearSelection: () => void;
}

export const useEmployeeSelectionStore = create<EmployeeSelectionStore>((set) => ({
  selectedDate: undefined,
  selectedEmployeeId: undefined,
  selectedEmployeeName: undefined,
  selectedTimeSlot: undefined,
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    // Si cambia la fecha, limpiar el horario seleccionado
    if (date) {
      set({ selectedTimeSlot: undefined });
    }
  },
  setSelectedEmployee: (employeeId, employeeName) => {
    set((state) => {
      // Solo limpiar fecha y horario si el empleado es diferente
      if (employeeId && employeeId !== state.selectedEmployeeId) {
        return {
          selectedEmployeeId: employeeId,
          selectedEmployeeName: employeeName,
          selectedDate: undefined,
          selectedTimeSlot: undefined,
        };
      }
      // Si es el mismo empleado o undefined, solo actualizar el ID y nombre
      return {
        selectedEmployeeId: employeeId,
        selectedEmployeeName: employeeName,
      };
    });
  },
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  clearSelection: () => set({ 
    selectedDate: undefined, 
    selectedEmployeeId: undefined,
    selectedEmployeeName: undefined,
    selectedTimeSlot: undefined 
  }),
}));