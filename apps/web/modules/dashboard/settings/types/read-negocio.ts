export interface Negocio {
  name: string;
  slugName: string;
  phoneNumber: string;
  slogan: string | null;
  address: string | null;
  workDays: string[];
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
  user: {
    name: string;
    id: string;
  };
  imageUrl: string;
}
