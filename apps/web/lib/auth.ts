import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { safeDb, isDatabaseAvailable } from './prisma';

// Build auth options based on database availability
const buildAuthOptions = (): NextAuthOptions => {
  const baseOptions: NextAuthOptions = {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
      }),
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 587,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM || 'noreply@swiftapi.dev',
      }),
    ],
    pages: {
      signIn: '/',
      verifyRequest: '/auth/verify-request',
      error: '/auth/error',
    },
  };

  // If database is available, use database session strategy with Prisma adapter
  if (isDatabaseAvailable() && safeDb) {
    return {
      ...baseOptions,
      adapter: PrismaAdapter(safeDb) as any,
      callbacks: {
        session: async ({ session, user }) => {
          if (session?.user) {
            session.user.id = user.id;

            // Fetch subscription status for the session
            try {
              const subscription = await safeDb!.subscription.findUnique({
                where: { userId: user.id },
              });

              // Add subscription info to session
              (session as any).subscription = subscription
                ? {
                    status: subscription.status,
                    plan: subscription.status === 'active' ? 'Pro' : 'Free',
                  }
                : {
                    status: 'inactive',
                    plan: 'Free',
                  };
            } catch (error) {
              console.warn('Failed to fetch subscription:', error);
              (session as any).subscription = {
                status: 'inactive',
                plan: 'Free',
              };
            }
          }
          return session;
        },
        signIn: async ({ user, account, profile }) => {
          // Allow sign-in
          return true;
        },
      },
      session: {
        strategy: 'database' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    };
  }

  // If database is not available, use JWT session strategy (no adapter)
  console.warn('Auth running in demo mode without database - using JWT sessions');
  return {
    ...baseOptions,
    callbacks: {
      jwt: async ({ token, user, account, profile }) => {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      session: async ({ session, token }) => {
        if (session?.user && token) {
          (session.user as any).id = token.id || token.sub;
          // Demo mode - always Free plan
          (session as any).subscription = {
            status: 'inactive',
            plan: 'Free',
          };
        }
        return session;
      },
    },
    session: {
      strategy: 'jwt' as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  };
};

export const authOptions = buildAuthOptions();
