export interface CreateNegocioDTO {
  name: string;
  image: File | string;
  slugName: string;
  phoneNumber: string;
  slogan?: string;
  address?: string;
  workDays: string[];
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
  hasImageChanged: boolean;
}