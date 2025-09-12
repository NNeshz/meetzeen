import Elysia, { t } from "elysia";
import { progressModule } from "@meetzeen/api/src/modules/progress/progress.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const progressRoute = new Elysia({
  name: "progressRoute",
  prefix: "/progress",
})
  .use(betterAuthPlugin)
  .use(progressModule)
  .get(
    "/",
    async ({ progressService, user }) =>
      await progressService.getUserProgress(user.id),
    {
      authenticated: true,
    }
  )
  .patch(
    "/step/:stepId",
    async ({ progressService, user, params }) =>
      await progressService.updateProgressStep(
        user.id,
        parseInt(params.stepId)
      ),
    {
      authenticated: true,
      params: t.Object({
        stepId: t.String(),
      }),
    }
  );
