import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_SSO_CLIENT_ID as string,
      clientSecret: process.env.AZURE_SSO_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_TENANT_ID as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const testUser1 = {
          id: "1",
          name: "Sarah Miller",
          email: "sarah.miller@example.com",
        };
        const testUser2 = {
          id: "2",
          name: "David Johnson",
          email: "david.johnson@example.com",
        };
        if (
          credentials &&
          credentials.username === "demo" &&
          credentials.password === "demo"
        ) {
          return testUser1;
        } else if (
          credentials &&
          credentials.username === "demo2" &&
          credentials.password === "demo2"
        ) {
          return testUser2;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "azure-ad") {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              azureId: user.id,
              email: user.email as string,
              name: user.name,
            },
          });
        }
        return dbUser !== null;
      }
      return true;
    },
  },
};
