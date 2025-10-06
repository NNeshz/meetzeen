// Hook compuesto que combina todos los slices para facilitar su uso
import { useServicesStore } from './servicesSlice';
import { useScheduleStore } from './scheduleSlice';
import { useCustomerStore } from './customerSlice';
import { useBookingStore } from './bookingSlice';
import { useStepsStore } from './useStepsStore';

export const useBookingStores = () => {
  const services = useServicesStore();
  const schedule = useScheduleStore();
  const customer = useCustomerStore();
  const booking = useBookingStore();
  const steps = useStepsStore();

  return {
    // Services
    selectedServicesWithEmployees: services.selectedServicesWithEmployees,
    addService: services.addService,
    removeService: services.removeService,
    toggleService: services.toggleService,
    clearServices: services.clearServices,
    addEmployeeToService: services.addEmployeeToService,
    removeEmployeeFromService: services.removeEmployeeFromService,
    toggleEmployeeForService: services.toggleEmployeeForService,
    isServiceSelected: services.isServiceSelected,
    isEmployeeSelectedForService: services.isEmployeeSelectedForService,
    areAllServicesComplete: services.areAllServicesComplete,
    getServicesForBackend: services.getServicesForBackend,

    // Schedule
    availabilityData: schedule.availabilityData,
    serviceSelections: schedule.serviceSelections,
    isUsingSlot: schedule.isUsingSlot,
    setAvailabilityData: schedule.setAvailabilityData,
    setServiceSelection: schedule.setServiceSelection,
    getServiceSelection: schedule.getServiceSelection,
    areAllServiceSelectionsComplete: schedule.areAllServiceSelectionsComplete,
    applySlotSelection: schedule.applySlotSelection,
    clearSlotSelection: schedule.clearSlotSelection,
    canUseSlot: schedule.canUseSlot,
    reorderSlotServices: schedule.reorderSlotServices,
    getScheduleForBackend: schedule.getScheduleForBackend,

    // Customer
    customerData: customer.customerData,
    setCustomerData: customer.setCustomerData,
    updateCustomerField: customer.updateCustomerField,
    isCustomerDataComplete: customer.isCustomerDataComplete,
    getCustomerDataErrors: customer.getCustomerDataErrors,
    getCustomerForBackend: customer.getCustomerForBackend,

    // Booking
    organizationId: booking.organizationId,
    setOrganizationId: booking.setOrganizationId,
    prepareBookingPayload: booking.prepareBookingPayload,
    calculateTotalDuration: booking.calculateTotalDuration,
    calculateTotalPrice: booking.calculateTotalPrice,
    canProceedToBooking: booking.canProceedToBooking,
    getBookingValidationErrors: booking.getBookingValidationErrors,

    // Steps
    step: steps.step,
    nextStep: steps.nextStep,
    prevStep: steps.prevStep,
    canProceedToNextStep: steps.canProceedToNextStep,
    goToStep: steps.goToStep,

    // Reset all
    resetAllStores: () => {
      services.reset();
      schedule.reset();
      customer.reset();
      booking.resetAllStores();
      steps.reset();
    },
  };
};

// Hook específico para cada slice (para uso individual si es necesario)
export { useServicesStore } from './servicesSlice';
export { useScheduleStore } from './scheduleSlice';
export { useCustomerStore } from './customerSlice';
export { useBookingStore } from './bookingSlice';
export { useStepsStore } from './useStepsStore';

// Exportar tipos
export type * from './types';