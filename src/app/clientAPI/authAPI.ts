import pckeChallenge from "pkce-challenge";

export async function getAuthURL() {
  let local_code_verifier = localStorage.getItem("code_verifier");
  let local_code_challenge = localStorage.getItem("code_challenge");

  if (!local_code_challenge && !local_code_verifier) {
    let { code_verifier, code_challenge } = await pckeChallenge();

    local_code_challenge = code_challenge;
    local_code_verifier = code_verifier;

    localStorage.setItem("code_verifier", code_verifier);
    localStorage.setItem("code_challenge", code_challenge);

    console.log("code_challenge: ", local_code_challenge);
    console.log("code_verifier: ", local_code_verifier);
  }

  const redirect_uri = "http://localhost:3000/auth";
  const client_id = "sq0idp-tDr6r_tlpCjHD9tDQrV8mg";

  const url = `https://connect.squareup.com/oauth2/authorize?client_id=${client_id}&scope=MERCHANT_PROFILE_READ&session=false&redirect_uri=${redirect_uri}&code_challenge=${local_code_challenge}`;

  console.log(url);

  return url;
}
