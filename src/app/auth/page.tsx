"use client";

import React, { useEffect, useCallback } from "react";
import { Form, Button, Flex, theme } from "antd";
import Item from "antd/lib/list/Item";
import { useSearchParams, useRouter } from "next/navigation";
import { handleGetAndSetToken } from "../clientAPI/authAPI";
import lodash from "lodash";
import { toast } from "react-hot-toast";

const { useToken } = theme;

function AuthForm() {
  const { token } = useToken();
  const handleSubmit = useCallback(async () => {
    try {
      const resp = await fetch("/api/authTokenAPI", {
        method: "GET",
      });

      const { url } = await resp.json();

      window.open(url);
    } catch (error) {
      console.error("Error: ", error);
    }
  }, []);

  const params = useSearchParams();
  const router = useRouter();

  const getParamAndCall = useCallback(async () => {
    if (params.get("code")) {
      let authCode;
      authCode = params.get("code") as string;
      const resp = await handleGetAndSetToken(authCode);
      if (resp.status === 200) {
        toast.success("Login Successful.", {
          style: {
            border: `1px solid ${token.colorSuccess}`,
            padding: "16px",
            color: token.colorSuccess,
            fontSize: "20px",
          },
          iconTheme: {
            primary: token.colorSuccess,
            secondary: "white",
          },
        });
        router.push("/mainpage");
      }
    }
  }, [params, router]);

  const debouncedGetParamAndCall = lodash.debounce(getParamAndCall, 1500);

  useEffect(() => {
    debouncedGetParamAndCall();
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
