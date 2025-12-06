export interface CreateServiceDto {
  name: string;
  serviceCategoryId: string;
  description: string;
  price: number;
  duration: number;
  discount: number;
}

export interface UpdateServiceDto {
  id: string;
  name: string;
  serviceCategoryId: string;
  description: string;
  price: number;
  duration: number;
  discount: number;
}

export interface Service {
  id: string;
  name: string;
  serviceCategoryId: string | null;
  description: string | null;
  price: string;
  duration: number;
  discount: number | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}