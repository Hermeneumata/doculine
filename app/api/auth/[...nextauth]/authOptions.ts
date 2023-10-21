import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
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
};
