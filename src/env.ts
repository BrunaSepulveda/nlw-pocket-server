import z from "zod";

const envSchema = z.object({
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_TYPE: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
});

export const env = envSchema.parse(
  process.env
);
