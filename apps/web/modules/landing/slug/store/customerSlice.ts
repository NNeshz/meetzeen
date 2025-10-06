import { create } from 'zustand';
import { CustomerData } from './types';

interface CustomerState {
  customerData: CustomerData;
  
  // Actions
  setCustomerData: (data: Partial<CustomerData>) => void;
  updateCustomerField: (field: keyof CustomerData, value: string) => void;
  
  // Validation
  isCustomerDataComplete: () => boolean;
  getCustomerDataErrors: () => Partial<Record<keyof CustomerData, string>>;
  
  // Data preparation for backend
  getCustomerForBackend: () => {
    name: string;
    phone: string;
    email: string;
  };
  
  reset: () => void;
}

const initialState: CustomerData = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customerData: initialState,
  
  setCustomerData: (data) => set((state) => ({
    customerData: { ...state.customerData, ...data }
  })),
  
  updateCustomerField: (field, value) => set((state) => ({
    customerData: { ...state.customerData, [field]: value }
  })),
  
  isCustomerDataComplete: () => {
    const { customerData } = get();
    return !!(
      customerData.name.trim() &&
      customerData.lastName.trim() &&
      customerData.email.trim() &&
      customerData.phone.trim()
    );
  },
  
  getCustomerDataErrors: () => {
    const { customerData } = get();
    const errors: Partial<Record<keyof CustomerData, string>> = {};
    
    if (!customerData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (customerData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!customerData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    } else if (customerData.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (!customerData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = 'El formato del email es inválido';
    }
    
    if (!customerData.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(customerData.phone)) {
      errors.phone = 'El formato del teléfono es inválido';
    }
    
    return errors;
  },
  
  getCustomerForBackend: () => {
    const { customerData } = get();
    return {
      name: `${customerData.name.trim()} ${customerData.lastName.trim()}`,
      phone: customerData.phone.trim(),
      email: customerData.email.trim(),
    };
  },
  
  reset: () => set({ customerData: initialState }),
}));