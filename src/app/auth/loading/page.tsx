"use client";

import { handleGetAndSetToken } from "@/app/clientAPI/authAPI";
import { Flex, Spin, theme } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import lodash from "lodash";

const { useToken } = theme;

function LoggingInForm() {
  const { token } = useToken();
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
    <Flex
      align="center"
      justify="center"
      gap="middle"
      style={{ height: "100%" }}
    >
      <h6
        style={{
          color: token.colorPrimary,
        }}
      >
        Logging you in...
      </h6>
      <br />
      <Spin size="large" />
    </Flex>
  );
}

export default LoggingInForm;
