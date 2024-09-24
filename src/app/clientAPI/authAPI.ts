"use client";

export async function handleObtainToken(authCode: string) {
  console.log("Handle Obtain Token" + authCode);
  try {
    if (authCode) {
      const resp = await fetch("/api/authTokenAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authenticationCode: authCode,
        }),
      });

      if (resp.status == 200) {
        const { message } = await resp.json();
        return { message, status: resp.status };
      } else {
        throw new Error("authTokenAPI fetch failed.");
      }
    } else {
      throw new Error("No authCode provided.");
    }
  } catch (error) {
    console.error(error);
    return { data: error, status: 500 };
  }
}

export async function handleGetAndSetToken(authCode: string) {
  try {
    const resp = await handleObtainToken(authCode);
    if (resp.status === 200) return { status: resp.status };
    else throw new Error("Check obtainToken API for Errors.");
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
