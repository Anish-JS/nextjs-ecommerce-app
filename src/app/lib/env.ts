import zod from "zod";

const envSchema = zod.object({
  DATABASE_URL: zod.string().min(1, { message: "DB_URL DOESNT exist" }),
  GOOGLE_CLIENT_ID: zod.string().min(1, { message: "Check ENV" }),
  GOOGLE_CLIENT_SECRET: zod.string().min(1, { message: "Check ENV" }),
  NEXTAUTH_URL: zod.string().min(1, { message: "Check ENV" }),
  NEXTAUTH_SECRET: zod.string().min(1, { message: "Check ENV" }),
});

export const env = envSchema.parse(process.env);
