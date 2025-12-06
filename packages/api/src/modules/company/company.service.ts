import { auth } from "@meetzeen/auth";
import { _prisma } from "@meetzeen/api/src/modules/prisma";

export class CompanyService {
  constructor() {}

  async createCompany(
    companyName: string,
    timezone: string,
    currency: string,
    userId: string,
    headers: Headers
  ) {
    // Crear slug único basado en el nombre
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    // Usar Better Auth API para crear la organización
    // Esto asegura que listOrganizations funcione correctamente
    const organization = await auth.api.createOrganization({
      headers,
      body: {
        name: companyName,
        slug,
        userId,
      },
    });

    if (!organization) {
      throw new Error("Failed to create organization");
    }

    // Actualizar la organización con los campos adicionales (timezone, currency)
    const updatedOrganization = await _prisma.organization.update({
      where: { id: organization.id },
      data: {
        timezone,
        currency,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return updatedOrganization;
  }
}
