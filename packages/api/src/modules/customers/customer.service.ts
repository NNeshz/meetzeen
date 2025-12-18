import { db, customer, appointment } from "@meetzeen/database";
import { and, desc, asc, eq, or, ilike, count, sql } from "drizzle-orm";

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
        eq(customer.organizationId, data.organizationId),
        eq(customer.isActive, true)
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
        eq(customer.organizationId, organizationId),
        eq(customer.isActive, true)
      ),
    });
  }

  async getAllCustomers(
    organizationId: string,
    limit?: number,
    offset?: number,
    search?: string,
    sortBy?: string
  ) {
    const finalLimit = limit ?? 50;
    const finalOffset = offset ?? 0;

    const whereConditions: Parameters<typeof and>[0][] = [
      eq(customer.organizationId, organizationId),
      eq(customer.isActive, true), // Solo clientes activos
    ];

    if (search && search.trim() !== "") {
      const searchCondition = or(
        ilike(customer.name, `%${search}%`),
        ilike(customer.lastName, `%${search}%`),
        ilike(customer.email, `%${search}%`)
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    const totalCustomers = await db
      .select({ count: count() })
      .from(customer)
      .where(
        and(
          eq(customer.organizationId, organizationId),
          eq(customer.isActive, true)
        )
      )
      .then(([res]) => Number(res?.count ?? 0));

    const filteredCustomers = await db
      .select({ count: count() })
      .from(customer)
      .where(and(...whereConditions))
      .then(([res]) => Number(res?.count ?? 0));

    let order = desc(customer.createdAt); // Por defecto: más reciente primero
    if (sortBy === "recent" || sortBy === "newest") {
      order = desc(customer.createdAt);
    } else if (sortBy === "oldest" || sortBy === "old") {
      order = asc(customer.createdAt);
    }

    const customers = await db
      .select({
        id: customer.id,
        name: customer.name,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        totalAppointments: customer.totalAppointments,
        lastAppointmentDate: customer.lastAppointmentDate,
        isActive: customer.isActive,
      })
      .from(customer)
      .where(and(...whereConditions))
      .limit(finalLimit)
      .offset(finalOffset)
      .orderBy(order);

    return {
      results: customers,
      meta: {
        totalCustomers,
        filteredCustomers,
        limit: finalLimit,
        offset: finalOffset,
        hasNextPage: finalOffset + finalLimit < filteredCustomers,
        hasPrevPage: finalOffset > 0,
      },
    };
  }
}
