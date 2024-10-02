"use client";

import React, { useCallback, useState } from "react";
import { Form, Button, Flex } from "antd";
import Item from "antd/lib/list/Item";
import { toast } from "react-hot-toast";
import { useHandleSubmit } from "../hooks/useHandleSubmit";

function AuthForm() {
  const { handleSubmit } = useHandleSubmit();
  const [clicked, setClicked] = useState(false);

  const handleSetClickTrue = useCallback(() => {
    if (!clicked) {
      setClicked(true);
    }
    toast.loading("Authorizing...", {
      style: {
        fontSize: "20px",
      },
    });
  }, [clicked]);

  const handleSetClickFalse = useCallback(() => {
    setClicked(false);
    toast.dismiss();
  }, [setClicked]);

  const callHandleSubmit = useCallback(async () => {
    handleSetClickTrue();
    const result = await handleSubmit();
    if (result.status === 200) {
      const { url } = result;
      console.log(url);
      window.location.replace(url);
    } else {
      handleSetClickFalse();
      toast.error("Error: Could not authenticate, API Offline.", {
        style: {
          fontSize: "20px",
        },
      });
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
              onClick={callHandleSubmit}
              disabled={clicked}
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
