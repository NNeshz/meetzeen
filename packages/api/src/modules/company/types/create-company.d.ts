import { z } from "zod";

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").optional(),
  phoneNumber: z.string().min(5, "El teléfono es obligatorio").optional(),
  slogan: z.string().optional(),
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;

export const CompanyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  imageUrl: z.string(),
  slogan: z.string().nullable(),
  userId: z.string(),
  address: z.string().nullable(),
  workDays: z.array(z.string()),
  startHour: z.string(),
  startMinute: z.string(),
  startAmPm: z.string(),
  endHour: z.string(),
  endMinute: z.string(),
  endAmPm: z.string(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  twitterX: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompanyResponseDTO = z.infer<typeof CompanyResponseSchema>;