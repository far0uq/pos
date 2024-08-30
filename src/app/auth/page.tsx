"use client";

import React, { useEffect } from "react";
import { Form, Input, Button, Flex, Space } from "antd";
import Item from "antd/lib/list/Item";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getAuthURL,
  handleCookiefication,
  handleGetAndSetToken,
  handleObtainToken,
} from "../clientAPI/authAPI";

function AuthForm() {
  const handleSubmit = async () => {
    try {
      const url = await getAuthURL();
      window.open(url);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const params = useSearchParams();
  const router = useRouter();

  const getParamAndCall = async () => {
    if (params.get("code")) {
      const authCode = params.get("code") as string;
      const resp = await handleGetAndSetToken(authCode);
      if (resp.status === 200) {
        console.log("Success");
        router.push("/mainpage");
      }
    }
  };

  useEffect(() => {
    getParamAndCall();
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
