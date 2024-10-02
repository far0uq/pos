import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { getTokenFromSession } from "./app/api/authTokenAPI/utils/getTokenFromSession";
import { tokenTypes } from "../types/tokenTypes";

export async function middleware(req: NextRequest) {
  try {
    const token = await getTokenFromSession(tokenTypes.tokenTypeVerification);

    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }
    const secret = process.env.NEXTAUTH_SECRET as string;
    const res = await jose.jwtVerify(token, new TextEncoder().encode(secret));

    if (!res.payload) {
      throw new Error(
        "Token could not be verified. There is a discrepancy in the secret or the token is not present."
      );
    }

    const pathname = new URL(req.url).pathname;

    if (pathname === "/mainpage") {
      return NextResponse.next(); // Do nothing, allow the page to load
    }

    return NextResponse.redirect(new URL("/mainpage", req.url));
  } catch (error) {
    const pathname = new URL(req.url).pathname;
    if (pathname === "/auth") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/mainpage", "/auth", "/"],
};
