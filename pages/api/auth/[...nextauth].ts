import authUser from "@/utils/server/authUser";
import getUser from "@/utils/server/get/getUser";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2592000,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      // @ts-ignore
      async authorize(credentials, req) {
        const { email, password, telegram_credentials } = credentials as {
          email: string;
          password: string;
          telegram_credentials?: any;
        };

        if (telegram_credentials) {
          const authData = await (
            await fetch(`${process.env.apiUrl}/auth/telegram`, {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: telegram_credentials,
            })
          ).json();

          if (authData?.status) {
            const user = await getUser({
              telegramId: JSON.parse(telegram_credentials).id,
              token: authData.data.data,
            });

            return { token: authData.data.data, id: user?.id };
          }
        }

        const authData = await authUser({ subject: email, password });

        if (authData) {
          let user = await getUser({ email: email, token: authData.token });
          if (user == null) {
            user = await getUser({ login: email, token: authData.token });
          }

          return { token: authData.token, id: user?.id };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);   
      return token;
    },
    session: async ({ session, token }) => {
      
      session.user = token.user as { token: string; id: string };
      
      return session;
    },
  },
};

export default NextAuth(authOptions);
