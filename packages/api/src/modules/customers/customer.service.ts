import { db, customer } from "@meetzeen/database";
import { and, eq } from "drizzle-orm";

export class CustomerService {
  constructor() {}

  /**
   * Crea o actualiza un cliente (upsert por email + organizationId)
   */
  async upsertCustomer(data: {
    organizationId: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  }) {
    const existing = await db.query.customer.findFirst({
      where: and(
        eq(customer.email, data.email),
        eq(customer.organizationId, data.organizationId)
      ),
    });

    if (existing) {
      // Actualizar solo el teléfono si se proporciona
      // El email NO se cambia (es el campo clave)
      // El nombre y apellido NO se cambian si ya existen
      const updates: Partial<typeof customer.$inferInsert> = {};
      
      // Solo actualizar teléfono si se proporciona y es diferente
      if (data.phoneNumber && existing.phoneNumber !== data.phoneNumber) {
        updates.phoneNumber = data.phoneNumber;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date().toISOString();
        const [updated] = await db
          .update(customer)
          .set(updates)
          .where(eq(customer.id, existing.id))
          .returning();
        return updated;
      }

      return existing;
    }

    // Crear nuevo cliente (solo si no existe)
    const [newCustomer] = await db
      .insert(customer)
      .values({
        organizationId: data.organizationId,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
      .returning();

    return newCustomer;
  }

  /**
   * Busca un cliente por email (dentro de una organización)
   */
  async findCustomerByEmail(email: string, organizationId: string) {
    return db.query.customer.findFirst({
      where: and(
        eq(customer.email, email),
        eq(customer.organizationId, organizationId)
      ),
    });
  }
}