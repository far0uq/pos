import { Client, Environment } from "square";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const client = new Client({
      environment: Environment.Production,
      userAgentDetail: "Dorya Inc.",
    });

    console.log("Entered POST");
    const { codeVerifier, authenticationCode } = await req.json();

    console.log(authenticationCode);
    console.log(codeVerifier);

    const response = await client.oAuthApi.obtainToken({
      clientId: "sq0idp-tDr6r_tlpCjHD9tDQrV8mg",
      grantType: "authorization_code",
      codeVerifier: codeVerifier,
      code: authenticationCode,
      scopes: ["MERCHANT_PROFILE_READ"],
      redirectUri: "http://localhost:3000/auth",
      shortLived: true,
    });

    console.log(response);

    return NextResponse.json(
      {
        accessToken: response.result.accessToken,
        refreshToken: response.result.refreshToken,
        expiresAt: response.result.expiresAt,
        merchantId: response.result.merchantId,
      },
      { status: response.statusCode }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "GET WRECKED!" }, { status: 500 });
  }
}
