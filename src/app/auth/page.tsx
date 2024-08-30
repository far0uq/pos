"use client";

import React, { useEffect } from "react";
import { Form, Input, Button, Flex, Space } from "antd";
import Item from "antd/lib/list/Item";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthURL } from "../clientAPI/authAPI";

function AuthForm() {
  const handleSubmit = async () => {
    try {
      const url = await getAuthURL();
      console.log(url);
      window.open(url);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const executeObtainToken = async () => {
      if (params.get("code")) {
        const authCode = params.get("code") as string;
        console.log(authCode);
        console.log(localStorage.getItem("code_verifier"));
        try {
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
          if (resp.status === 200) {
            const data = await resp.json();
            const cookie_resp = await fetch("/api/cookiefy", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                expiresAt: data.expiresAt,
                merchantId: data.merchantId,
              }),
            });

            if (cookie_resp.status === 200) router.push("/mainpage");
          }
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    };
    executeObtainToken();
  }, []);

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Form style={{ height: "13%", width: "15%" }}>
        <Flex style={{ height: "100%" }} justify="space-between" vertical>
          <Item>
            <h4>Authorization required for Dorya Inc.</h4>
          </Item>
          <Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              onClick={handleSubmit}
            >
              Authorize
            </Button>
          </Item>
        </Flex>
      </Form>
    </Flex>
  );
}

export default AuthForm;
