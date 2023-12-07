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
        const user = { id: "1", name: "Test", email: "test@test.com" };
        if (
          credentials &&
          credentials.username === "test" &&
          credentials.password === "test"
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account }) {
    //   if (account?.provider === "azure-ad") {
    //     let dbUser = await prisma.user.findUnique({
    //       where: { azureId: user.id },
    //     });
    //     if (!dbUser) {
    //       dbUser = await prisma.user.create({
    //         data: {
    //           azureId: user.id,
    //           email: user.email as string,
    //           name: user.name,
    //         },
    //       });
    //     }
    //     return dbUser !== null;
    //   }
    //   return true;
    // },
  },
};
