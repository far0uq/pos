import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./app/api/authTokenAPI/utils/sessionHelper";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Session is missing.");
    } else if (!session.token) {
      throw new Error("Session token is missing.");
    }
    const token = session.token;

    const secret = process.env.NEXTAUTH_SECRET as string;

    const res = await jose.jwtVerify(token, new TextEncoder().encode(secret));

    if (!res.payload) {
      throw new Error(
        "Token could not be verified. There is a discrepancy in the secret or the token is not present."
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/mainpage"],
};
