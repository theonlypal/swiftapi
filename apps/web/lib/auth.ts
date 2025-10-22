import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;

        // Fetch subscription status for the session
        const subscription = await prisma.subscription.findUnique({
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
      }
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      // Allow sign-in
      return true;
    },
  },
  pages: {
    signIn: '/',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
