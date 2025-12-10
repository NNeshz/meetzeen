import { db, member, user } from "@meetzeen/database";
import { eq, inArray } from "drizzle-orm";

export class TeamService {
  constructor() {}

  async getTeam(organizationId: string) {
    const team = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
    });

    const userIds = team.map((member) => member.userId);
    const users = await db.query.user.findMany({
      where: inArray(user.id, userIds),
    });

    const teamWithRoles = users.map((user) => ({
      image: user.image,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: team.find((m) => m.userId === user.id)?.role,
      id: user.id,
    }));

    return teamWithRoles;
  }
}
