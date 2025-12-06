import { Elysia } from "elysia";
import { auth } from "@meetzeen/auth";

export const betterAuthPlugin = new Elysia({ name: "better-auth-plugin" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) throw new Error("Unauthorized");

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });