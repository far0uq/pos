"use client";
import pckeChallenge from "pkce-challenge";

export async function getAuthURL() {
  let codeVerifier = localStorage.getItem("code_verifier");
  let codeChallenge = localStorage.getItem("code_challenge");

  const challengeInfoExists = codeVerifier && codeChallenge;

  if (!challengeInfoExists) {
    let { code_verifier, code_challenge } = await pckeChallenge();

    codeVerifier = code_verifier;
    codeChallenge = code_challenge;

    localStorage.setItem("code_verifier", codeVerifier);
    localStorage.setItem("code_challenge", codeChallenge);
  }

  const redirectURI = "http://localhost:3000/auth";
  const clientID = "sq0idp-tDr6r_tlpCjHD9tDQrV8mg";

  const url = `https://connect.squareup.com/oauth2/authorize?client_id=${clientID}&scope=MERCHANT_PROFILE_READ&session=false&redirect_uri=${redirectURI}&code_challenge=${codeChallenge}`;

  console.log(url);
  return url;
}

export async function handleObtainToken(authCode: string) {
  try {
    if (authCode) {
      const resp = await fetch("/api/authTokenAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeVerifier: localStorage.getItem("code_verifier"),
          authenticationCode: authCode,
        }),
      });

      if (resp.status == 200) {
        const data = await resp.json();
        return { data, status: resp.status };
      } else {
        throw new Error("authTokenAPI failed.");
      }
    } else {
      throw new Error("No authCode provided.");
    }
  } catch (error) {
    console.error(error);
    return { data: error, status: 500 };
  }
}

export async function handleCookiefication(data: any) {
  try {
    const { accessToken, refreshToken, expiresAt, merchantId } = data;
    const resp = await fetch("/api/cookiefy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        expiresAt,
        merchantId,
      }),
    });
    if (resp.status == 200) return { status: resp.status };
    else {
      throw new Error("Error in cookiefication");
    }
  } catch (error) {
    console.log(error);
    return { data: error, status: 500 };
  }
}

export async function handleGetAndSetToken(authCode: string) {
  try {
    const resp = await handleObtainToken(authCode);
    if (resp.status === 200) {
      const cookieResp = await handleCookiefication(resp.data);
      if (cookieResp.status === 200) return { status: cookieResp.status };
      else throw new Error("Check cookiefication API for Errors.");
    } else {
      throw new Error("Check obtainToken API for Errors.");
    }
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
