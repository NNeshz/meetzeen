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
    const slug =
      companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

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

  async getCompany(organizationId: string) {
    const [company] = await db
      .select({
        logo: organization.logo,
        name: organization.name,
        slug: organization.slug,
        timezone: organization.timezone,
        currency: organization.currency,
        workdays: organization.workdays,
        startTime: organization.startTime,
        endTime: organization.endTime,
        location: organization.location,
        facebookLink: organization.facebookLink,
        instagramLink: organization.instagramLink,
        whatsappLink: organization.whatsappLink,
        tiktokLink: organization.tiktokLink,
      })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1);

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  async updateCompanyName(companyName: string, organizationId: string) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ name: companyName })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateCompanyTimezone(timezone: string, organizationId: string) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ timezone })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateCompanyCurrency(currency: string, organizationId: string) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ currency })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateCompanySlug(slug: string, organizationId: string) {
    // Check if the slug is already taken
    const existingOrganization = await db
      .select()
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1);

    if (existingOrganization.length > 0) {
      throw new Error("Slug already taken");
    }

    const [updatedOrganization] = await db
      .update(organization)
      .set({ slug })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateCompanyWorkdays(workdays: number[], organizationId: string) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ workdays })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateStartHour(
    startHour: number,
    startMinute: number,
    organizationId: string
  ) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ startTime: `${startHour}:${startMinute}` })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateEndHour(
    endHour: number,
    endMinute: number,
    organizationId: string
  ) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ endTime: `${endHour}:${endMinute}` })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateLocation(location: string, organizationId: string) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ location })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }

  async updateSocialLinks(
    socialLinks: {
      facebookLink?: string;
      instagramLink?: string;
      whatsappLink?: string;
      tiktokLink?: string;
    },
    organizationId: string
  ) {
    const [updatedOrganization] = await db
      .update(organization)
      .set({ ...socialLinks })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrganization;
  }
}
