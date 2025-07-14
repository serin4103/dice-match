import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      email: string;
      isRegistered?: boolean;
      win: number;
      lose: number;
      username: string;
      profilePicture?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email?: string;
    isRegistered?: boolean;
    win: number;
    lose: number;
    username: string;
    profilePicture?: string;
  }
}