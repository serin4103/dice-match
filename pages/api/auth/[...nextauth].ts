import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
            }
            const existingUser = await prisma.user.findUnique({
                where: { email: token.email! },
            });
            token.isRegistered = !!existingUser?.username;
            token.win = existingUser?.win ?? 0;
            token.lose = existingUser?.lose ?? 0;
            token.username = existingUser?.username;
            token.profilePicture = existingUser?.profilePicture;
            token.id = existingUser?.id;
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.email = token.email!;
            session.user.isRegistered = token.isRegistered;
            session.user.win = token.win;
            session.user.lose = token.lose;
            session.user.username = token.username;
            session.user.profilePicture = token.profilePicture;
            session.user.id = token.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export default handler;
