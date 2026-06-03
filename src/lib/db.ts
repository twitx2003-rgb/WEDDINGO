import { PrismaClient } from '@prisma/client'

function buildUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  // Serverless: limit to 1 connection to avoid pool exhaustion on Vercel/Neon
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}connection_limit=1&pool_timeout=60`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
