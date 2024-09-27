"use client";

import React, { useCallback } from "react";
import { Form, Button, Flex, theme } from "antd";
import Item from "antd/lib/list/Item";

function AuthForm() {
  const handleSubmit = useCallback(async () => {
    try {
      const resp = await fetch("/api/authTokenAPI", {
        method: "GET",
      });

      const { url } = await resp.json();

      window.location.replace(url);
    } catch (error) {
      console.error("Error: ", error);
    }
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
