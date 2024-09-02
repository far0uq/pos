import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken, refreshToken, expiresAt, merchantId } = await req.json();
  cookies().set({
    name: "accessToken",
    value: accessToken,
    maxAge: expiresAt,
  });
  cookies().set({
    name: "refreshToken",
    value: refreshToken,
    maxAge: expiresAt,
  });
  cookies().set({
    name: "merchantId",
    value: merchantId,
    maxAge: expiresAt,
  });
  return NextResponse.json({ message: "Tokens are set" }, { status: 200 });
}
