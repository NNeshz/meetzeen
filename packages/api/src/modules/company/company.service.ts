import { auth } from "@meetzeen/auth";
import { db, organization, member, user } from "@meetzeen/database";
import { eq } from "drizzle-orm";

export class CompanyService {
  constructor() {}

  async getAllCompanies(userId: string) {
    const companies = await db
      .select({
        organization: {
          id: organization.id,
          name: organization.name,
          logo: organization.logo,
        },
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, userId));

    return companies;
  }

  async createCompany(
    companyName: string,
    timezone: string,
    currency: string,
    userId: string,
    headers: Headers
  ) {
    
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    const org = await auth.api.createOrganization({
      headers,
      body: {
        name: companyName,
        slug,
        userId,
      },
    });

    if (!org) {
      throw new Error("Failed to create organization");
    }

    const [updatedOrganization] = await db
      .update(organization)
      .set({
        timezone,
        currency,
      })
      .where(eq(organization.id, org.id))
      .returning();

    const membersWithUsers = await db
      .select({
        member: member,
        user: user,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, org.id));

    return {
      ...updatedOrganization,
      members: membersWithUsers.map(({ member: m, user: u }) => ({
        ...m,
        user: u,
      })),
    };
  }
}
