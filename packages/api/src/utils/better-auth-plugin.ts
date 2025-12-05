import { Elysia } from "elysia";
import { auth } from "@meetzeen/auth/index";

export const betterAuthPlugin = new Elysia({ name: "better-auth-plugin" })
  .mount(auth.handler)