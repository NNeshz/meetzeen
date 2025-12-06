export interface CreateServiceCategoryDto {
  name: string;
}

export interface UpdateServiceCategoryDto {
  id: string;
  name: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}