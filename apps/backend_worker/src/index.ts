import { api } from "@meetzeen/api/src";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

const PORT = Number(process.env.PORT) || 8080;
const HOSTNAME = "0.0.0.0";

const app = new Elysia()
  .use(api)
  .use(openapi())
  .listen({
    port: PORT,
    hostname: HOSTNAME,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);