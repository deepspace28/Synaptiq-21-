import { z } from "zod"

const envSchema = z.object({
  PYTHON_API_URL: z.string().url().default("http://localhost:8000/execute"),
  PYTHON_API_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  PYTHON_API_URL: process.env.PYTHON_API_URL,
  PYTHON_API_KEY: process.env.PYTHON_API_KEY,
})
