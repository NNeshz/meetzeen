import { db, serviceCategory } from "@meetzeen/database";
import { eq, and } from "drizzle-orm";

export class ServiceCategoryService {
  constructor() {}

  async createServiceCategory(name: string, organizationId: string) {
    const [newCategory] = await db
      .insert(serviceCategory)
      .values({
        id: crypto.randomUUID(),
        name,
        organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return newCategory;
  }

  async getAllServiceCategories(organizationId: string) {
    const categories = await db
      .select()
      .from(serviceCategory)
      .where(eq(serviceCategory.organizationId, organizationId));

    return categories;
  }

  async getServiceCategoryById(id: string, organizationId: string) {
    const [category] = await db
      .select()
      .from(serviceCategory)
      .where(
        and(
          eq(serviceCategory.id, id),
          eq(serviceCategory.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!category) {
      throw new Error("Service category not found");
    }

    return category;
  }

  async updateServiceCategory(
    id: string,
    organizationId: string,
    data: { name?: string }
  ) {
    const [updatedCategory] = await db
      .update(serviceCategory)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(serviceCategory.id, id),
          eq(serviceCategory.organizationId, organizationId)
        )
      )
      .returning();

    if (!updatedCategory) {
      throw new Error("Service category not found");
    }

    return updatedCategory;
  }

  async deleteServiceCategory(id: string, organizationId: string) {
    const [deletedCategory] = await db
      .delete(serviceCategory)
      .where(
        and(
          eq(serviceCategory.id, id),
          eq(serviceCategory.organizationId, organizationId)
        )
      )
      .returning();

    if (!deletedCategory) {
      throw new Error("Service category not found");
    }

    return deletedCategory;
  }
}
