import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';
import { nextCookies } from "better-auth/next-js";

export const createAuth = (env: Env) =>
  betterAuth({
    database: drizzleAdapter(drizzle(env.DB, { schema }), { provider: 'sqlite', schema }),
    emailAndPassword: { enabled: true, disableSignUp: true }, // admin only, no public signup
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL, // https://marysens-store.com
    plugins: [nextCookies()],
  });