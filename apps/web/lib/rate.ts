import { safeDb, isDatabaseAvailable } from './prisma';

// Rate limits per month
const FREE_MONTHLY_LIMIT = 2;
const PRO_MONTHLY_LIMIT = -1; // -1 means unlimited

export async function checkRateLimit(
  userId: string,
  isPro: boolean = false
): Promise<{ ok: boolean; remaining?: number | string }> {
  // If database is not available, allow limited access
  if (!isDatabaseAvailable() || !safeDb) {
    console.warn('Rate limit check skipped - database not available');
    return { ok: true, remaining: 'Demo mode' };
  }

  // Pro users have unlimited access
  if (isPro) {
    return { ok: true, remaining: 'Unlimited' };
  }

  // Calculate start of current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  // Find or create usage record for current month
  const usage = await safeDb.usage.findUnique({
    where: {
      userId_periodStart: {
        userId,
        periodStart: monthStart,
      },
    },
  });

  const currentCount = usage?.count || 0;
  const limit = FREE_MONTHLY_LIMIT;

  // Check if user has exceeded their monthly limit
  if (currentCount >= limit) {
    return { ok: false, remaining: 0 };
  }

  // Increment usage count
  await safeDb.usage.upsert({
    where: {
      userId_periodStart: {
        userId,
        periodStart: monthStart,
      },
    },
    create: {
      userId,
      periodStart: monthStart,
      count: 1,
    },
    update: {
      count: currentCount + 1,
    },
  });

  return { ok: true, remaining: limit - currentCount - 1 };
}

// Helper function to get current usage without incrementing
export async function getUsageInfo(userId: string, isPro: boolean = false) {
  // If database is not available, return demo data
  if (!isDatabaseAvailable() || !safeDb) {
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return {
      count: 0,
      limit: FREE_MONTHLY_LIMIT,
      remaining: FREE_MONTHLY_LIMIT,
      resetDate,
      demoMode: true,
    };
  }

  if (isPro) {
    return {
      count: 0,
      limit: 'Unlimited' as const,
      remaining: 'Unlimited' as const,
      resetDate: null,
    };
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const usage = await safeDb.usage.findUnique({
    where: {
      userId_periodStart: {
        userId,
        periodStart: monthStart,
      },
    },
  });

  const currentCount = usage?.count || 0;
  const limit = FREE_MONTHLY_LIMIT;

  // Calculate next reset date (first day of next month)
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    count: currentCount,
    limit,
    remaining: Math.max(0, limit - currentCount),
    resetDate,
  };
}
