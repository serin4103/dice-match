import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
            
            try {
                // 새로운 서버 API 호출
                const serverUrl = process.env.NEXT_PUBLIC_SERVER_UR || "http://localhost:4000";
                const response = await fetch(`${serverUrl}/user/${token.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const existingUser = await response.json();
                    token.isRegistered = existingUser.isRegistered;
                    token.win = existingUser.win ?? 0;
                    token.lose = existingUser.lose ?? 0;
                    token.username = existingUser.username;
                    token.profilePicture = existingUser.profilePicture;
                    token.id = existingUser.id;
                } else {
                    // 서버 오류 시 기본값 설정
                    token.isRegistered = false;
                    token.win = 0;
                    token.lose = 0;
                    token.username = null;
                    token.profilePicture = null;
                    token.id = null;
                }
            } catch (error) {
                console.error('Error fetching user from server:', error);
                // 오류 시 기본값 설정
                token.isRegistered = false;
                token.win = 0;
                token.lose = 0;
                token.username = null;
                token.profilePicture = null;
                token.id = null;
            }
            
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
