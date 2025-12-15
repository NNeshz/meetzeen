import { db, service, serviceCategory } from "@meetzeen/database";
import { eq, and } from "drizzle-orm";

export interface CreateServiceInput {
  name: string;
  serviceCategoryId?: string | null;
  description?: string | null;
  price: string | number;
  duration: number;
  discount?: number | null;
  organizationId: string;
}

export interface UpdateServiceInput {
  name?: string;
  serviceCategoryId?: string | null;
  description?: string | null;
  price?: string | number;
  duration?: number;
  discount?: number | null;
}

export class ServiceService {
  constructor() {}

  async createService(input: CreateServiceInput) {
    // Validar que la categoría pertenezca a la organización si se proporciona
    if (input.serviceCategoryId) {
      const [category] = await db
        .select()
        .from(serviceCategory)
        .where(
          and(
            eq(serviceCategory.id, input.serviceCategoryId),
            eq(serviceCategory.organizationId, input.organizationId)
          )
        )
        .limit(1);

      if (!category) {
        throw new Error(
          "Service category not found or does not belong to this organization"
        );
      }
    }

    const [newService] = await db
      .insert(service)
      .values({
        name: input.name,
        serviceCategoryId: input.serviceCategoryId || null,
        description: input.description || null,
        price: String(input.price),
        duration: input.duration,
        discount: input.discount || null,
        organizationId: input.organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return newService;
  }

  async getAllServices(organizationId: string, includeCategory = false) {
    if (includeCategory) {
      const services = await db
        .select({
          service: service,
          category: serviceCategory,
        })
        .from(service)
        .leftJoin(
          serviceCategory,
          eq(service.serviceCategoryId, serviceCategory.id)
        )
        .where(eq(service.organizationId, organizationId));

      return services.map(({ service: s, category }) => ({
        ...s,
        category: category || null,
      }));
    }

    const services = await db
      .select()
      .from(service)
      .where(eq(service.organizationId, organizationId));

    return services;
  }

  async getServiceById(id: string, organizationId: string, includeCategory = false) {
    if (includeCategory) {
      const [result] = await db
        .select({
          service: service,
          category: serviceCategory,
        })
        .from(service)
        .leftJoin(
          serviceCategory,
          eq(service.serviceCategoryId, serviceCategory.id)
        )
        .where(
          and(
            eq(service.id, id),
            eq(service.organizationId, organizationId)
          )
        )
        .limit(1);

      if (!result) {
        throw new Error("Service not found");
      }

      return {
        ...result.service,
        category: result.category || null,
      };
    }

    const [foundService] = await db
      .select()
      .from(service)
      .where(
        and(
          eq(service.id, id),
          eq(service.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!foundService) {
      throw new Error("Service not found");
    }

    return foundService;
  }

  async updateService(
    id: string,
    organizationId: string,
    data: UpdateServiceInput
  ) {
    // Validar que la categoría pertenezca a la organización si se proporciona
    if (data.serviceCategoryId) {
      const [category] = await db
        .select()
        .from(serviceCategory)
        .where(
          and(
            eq(serviceCategory.id, data.serviceCategoryId),
            eq(serviceCategory.organizationId, organizationId)
          )
        )
        .limit(1);

      if (!category) {
        throw new Error(
          "Service category not found or does not belong to this organization"
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.serviceCategoryId !== undefined)
      updateData.serviceCategoryId = data.serviceCategoryId || null;
    if (data.description !== undefined)
      updateData.description = data.description || null;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.discount !== undefined) updateData.discount = data.discount || null;

    const [updatedService] = await db
      .update(service)
      .set(updateData)
      .where(
        and(
          eq(service.id, id),
          eq(service.organizationId, organizationId)
        )
      )
      .returning();

    if (!updatedService) {
      throw new Error("Service not found");
    }

    return updatedService;
  }

  async deleteService(id: string, organizationId: string) {
    const [deletedService] = await db
      .delete(service)
      .where(
        and(
          eq(service.id, id),
          eq(service.organizationId, organizationId)
        )
      )
      .returning();

    if (!deletedService) {
      throw new Error("Service not found");
    }

    return deletedService;
  }
}

export const serviceService = new ServiceService();