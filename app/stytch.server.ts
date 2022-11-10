import { Client, envs } from "stytch";

if (!process.env.STYTCH_PROJECT_ID) {
  console.error("STYTCH_PROJECT_ID is not defined. Failure.");
}

if (!process.env.STYTCH_SECRET) {
  console.error("STYTCH_SECRET is not defined. Failure.");
}

if (!process.env.STYTCH_ENV) {
  console.error("STYTCH_ENV is not defined. Defaulting to test.");
}

export const stytchClient = new Client({
  project_id: process.env.STYTCH_PROJECT_ID || "STYTCH_PROJECT_ID_MISSING",
  secret: process.env.STYTCH_SECRET || "STYTCH_SECRET_MISSING",
  env: process.env.STYTCH_ENV === "live" ? envs.live : envs.test,
});
