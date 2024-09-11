"use server";
import { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getSession = async () => {
  interface SessionData {
    token: string;
  }

  const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
};
