import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Client, Environment } from "square";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  try {
    const accessToken = cookieStore.get("accessToken")?.value as string;
    const merchantId = cookieStore.get("merchantId")?.value as string;

    const accessInfoMissing = !accessToken && !merchantId;
    const accessInfoPresent = accessToken && merchantId;

    if (accessInfoMissing) {
      throw new Error("Access Info Missing");
    } else if (accessInfoPresent) {
      const client = new Client({
        environment: Environment.Production,
        accessToken: accessToken,
      });

      const response = await client.merchantsApi.retrieveMerchant(merchantId);

      if (response.statusCode === 200) {
        return NextResponse.next();
      } else {
        throw new Error(
          "Either Scope doesnt have access to Merchant Reading or Token Information is Incorrect."
        );
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/mainpage"],
};
