import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  phoneNumber: z.string().min(5, "El teléfono es obligatorio"),
  slogan: z.string().optional(),
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;

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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompanyResponseDTO = z.infer<typeof CompanyResponseSchema>;