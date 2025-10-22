import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAvailable: boolean | undefined;
};

// Check if DATABASE_URL is configured
export const isDatabaseAvailable = () => {
  return !!(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');
};

// Only initialize Prisma if DATABASE_URL is available
let prismaInstance: PrismaClient | null = null;

if (isDatabaseAvailable()) {
  try {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
    globalForPrisma.prismaAvailable = true;
  } catch (error) {
    console.warn('Failed to initialize Prisma client:', error);
    globalForPrisma.prismaAvailable = false;
  }
} else {
  console.warn('DATABASE_URL not configured - running in demo mode without database');
  globalForPrisma.prismaAvailable = false;
}

// Export a proxy that provides helpful error messages when database is not available
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!isDatabaseAvailable() || !prismaInstance) {
      throw new Error('Database not available. Please configure DATABASE_URL to use database features.');
    }
    return (prismaInstance as any)[prop];
  }
});

// Helper to safely use Prisma - returns null if database is not available
export const safeDb = isDatabaseAvailable() && prismaInstance ? prismaInstance : null;
