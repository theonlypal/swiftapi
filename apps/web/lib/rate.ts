import { prisma } from './prisma';

const FREE_DAILY_LIMIT = 50;
const PRO_DAILY_LIMIT = 1000;

export async function checkRateLimit(
  userId: string,
  isPro: boolean = false
): Promise<{ ok: boolean; remaining?: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await prisma.usage.findUnique({
    where: {
      userId_periodStart: {
        userId,
        periodStart: today,
      },
    },
  });

  const currentCount = usage?.count || 0;
  const limit = isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;

  if (currentCount >= limit) {
    return { ok: false, remaining: 0 };
  }

  await prisma.usage.upsert({
    where: {
      userId_periodStart: {
        userId,
        periodStart: today,
      },
    },
    create: {
      userId,
      periodStart: today,
      count: 1,
    },
    update: {
      count: currentCount + 1,
    },
  });

  return { ok: true, remaining: limit - currentCount - 1 };
}
