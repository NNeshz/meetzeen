export interface Period {
  value: string;
  label: string;
}

export const periods: Period[] = [
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
  { value: "2months", label: "2 meses" },
  { value: "3months", label: "3 meses" },
  { value: "6months", label: "6 meses" },
  { value: "1year", label: "1 año" },
];