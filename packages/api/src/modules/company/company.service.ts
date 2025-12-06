import { _prisma } from "@meetzeen/api/src/modules/prisma";
import { MEMBER_ROLE } from "@meetzeen/api/src/modules/company/constants/company.constants";

export class CompanyService {
  constructor() {}

  async createCompany(
    companyName: string,
    timezone: string,
    currency: string,
    userId: string
  ) {
    const now = new Date();

    // Create organization and member in a transaction
    const organization = await _prisma.organization.create({
      data: {
        name: companyName,
        timezone,
        currency,
        createdAt: now,
        members: {
          create: {
            userId,
            role: MEMBER_ROLE.OWNER,
            createdAt: now,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return organization;
  }
}
