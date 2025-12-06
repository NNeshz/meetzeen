import { create } from "zustand";

interface Organization {
  id: string;
  name: string;
  logo: string | null;
}

interface DashboardStore {
  organization: Organization | null;
  setOrganization: (organization: Organization) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  organization: null,
  setOrganization: (organization) => set({ organization }),
}));
