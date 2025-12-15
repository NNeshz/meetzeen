import Elysia from "elysia";
import { TeamService } from "@meetzeen/api/src/modules/team/team.service";

export const teamModule = new Elysia({
  name: "teamModule",
}).decorate("teamService", new TeamService());
