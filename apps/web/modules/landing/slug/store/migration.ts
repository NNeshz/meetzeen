// Archivo de migración para ayudar con la transición del store anterior a los nuevos slices
// Este archivo puede ser eliminado una vez que todos los componentes estén actualizados

import { useBookingStore as useOldBookingStore } from './useBookingStore';
import { useBookingStores } from './useBookingStores';

/**
 * Hook de compatibilidad que mapea la API del store anterior a los nuevos slices
 * Usar solo durante la migración
 * @deprecated Usar useBookingStores directamente
 */
export const useBookingStoreCompat = () => {
  const newStores = useBookingStores();
  
  return {
    // Mapeo de la API anterior a la nueva
    selectedServicesWithEmployees: newStores.selectedServicesWithEmployees,
    customerData: newStores.customerData,
    availabilityData: newStores.availabilityData,
    serviceSelections: newStores.serviceSelections,
    isUsingSlot: newStores.isUsingSlot,
    
    // Métodos mapeados
    toggleService: newStores.toggleService,
    toggleEmployeeForService: newStores.toggleEmployeeForService,
    isServiceSelected: newStores.isServiceSelected,
    isEmployeeSelectedForService: newStores.isEmployeeSelectedForService,
    areAllServicesComplete: newStores.areAllServicesComplete,
    setAvailabilityData: newStores.setAvailabilityData,
    setCustomerData: newStores.setCustomerData,
    setServiceSelection: newStores.setServiceSelection,
    getServiceSelection: newStores.getServiceSelection,
    areAllServiceSelectionsComplete: newStores.areAllServiceSelectionsComplete,
    applySlotSelection: newStores.applySlotSelection,
    clearSlotSelection: newStores.clearSlotSelection,
    canUseSlot: newStores.canUseSlot,
    reorderSlotServices: newStores.reorderSlotServices,
    
    // Métodos de pasos
    nextStep: newStores.nextStep,
    prevStep: newStores.prevStep,
    
    // Método de reset
    reset: newStores.resetAllStores,
    
    // Nuevos métodos disponibles
    getServicesForBackend: newStores.getServicesForBackend,
    getScheduleForBackend: newStores.getScheduleForBackend,
    getCustomerForBackend: newStores.getCustomerForBackend,
    prepareBookingPayload: newStores.prepareBookingPayload,
    calculateTotalDuration: newStores.calculateTotalDuration,
    calculateTotalPrice: newStores.calculateTotalPrice,
  };
};

/**
 * Función para migrar datos del store anterior a los nuevos slices
 * Ejecutar una sola vez durante la migración
 */
export const migrateStoreData = () => {
  const oldStore = useOldBookingStore.getState();
  const newStores = useBookingStores();
  
  // Migrar servicios seleccionados
  oldStore.selectedServicesWithEmployees.forEach(item => {
    newStores.addService(item.service, item.availableEmployees);
    item.selectedEmployees.forEach(employee => {
      newStores.addEmployeeToService(item.service.id, employee);
    });
  });
  
  // Migrar datos del cliente
  if (oldStore.customerData.name || oldStore.customerData.email) {
    newStores.setCustomerData(oldStore.customerData);
  }
  
  // Migrar datos de disponibilidad
  if (oldStore.availabilityData) {
    newStores.setAvailabilityData(oldStore.availabilityData);
  }
  
  // Migrar selecciones de servicios
  oldStore.serviceSelections.forEach(selection => {
    newStores.setServiceSelection(
      selection.serviceId,
      selection.employeeId,
      selection.selectedDate,
      selection.selectedTime
    );
  });
  
  console.log('Migración de datos completada');
};