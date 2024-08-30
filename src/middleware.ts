import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Client, Environment } from "square";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE");
  const cookieStore = cookies();
  try {
    console.log(cookieStore);
    const accessToken = cookieStore.get("accessToken")?.value as string;
    const merchantId = cookieStore.get("merchantId")?.value as string;

    console.log(accessToken);
    console.log(merchantId);

    if (accessToken && merchantId) {
      console.log("COMONNNN");
      const client = new Client({
        environment: Environment.Production,
        accessToken: accessToken,
      });

      const response = await client.merchantsApi.retrieveMerchant(merchantId);
      console.log(response);

      if (response.statusCode === 200) {
        console.log("MASHALLAH GOOD BOY");
        return NextResponse.next();
      } else {
        console.log("CLOSE BUT NO CIGAR");
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    } else {
      console.log("YOU ARE IN THE ELSE");
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/mainpage"],
};
