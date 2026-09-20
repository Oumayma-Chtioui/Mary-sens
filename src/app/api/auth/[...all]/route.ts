import { toNextJsHandler } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuth } from "../../../../auth";

export async function GET(req: Request) {
  const { env } = getCloudflareContext();
  return toNextJsHandler(createAuth(env as Env)).GET(req);
}

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  return toNextJsHandler(createAuth(env as Env)).POST(req);
}