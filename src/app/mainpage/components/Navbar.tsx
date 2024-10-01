"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button, Divider, Row, Col, Grid, Drawer, theme } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import WebsiteLogo from "./doryabooks.svg";
import CartContainer from "./cart/CartContainer";
import QueryClientWrapper from "@/app/wrapper/QueryClientWrapper";
import * as Sentry from "@sentry/react";
import { logoutSession } from "@/app/clientAPI/authAPI";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const { useBreakpoint } = Grid;
const { useToken } = theme;

function Navbar() {
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const { token } = useToken();
  const router = useRouter();

  const handleLogout = async () => {
    const resp = await logoutSession();
    if (resp.status === 200) {
      toast.success("Logged Out Successfully.", {
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
      router.push("/");
    }
  };

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occured in the Navbar</p>}>
      <Row
        style={{
          width: screens.sm ? "65%" : "90%",
          margin: "20px auto auto auto",
        }}
      >
        <Col xs={12} sm={8} lg={10}>
          <Image
            style={{ paddingTop: "10px" }}
            width={230}
            src={WebsiteLogo}
            alt="Logo"
            priority={true}
          />
        </Col>
        <Col
          xs={{ span: 4, offset: 4 }}
          sm={{ span: 2, offset: 11 }}
          lg={{ span: 1, offset: 11 }}
        >
          <Button type="text" style={{ width: "100%" }} onClick={openDrawer}>
            <ShoppingCartOutlined
              style={{
                fontSize: 30,
              }}
            />
          </Button>
          <Drawer
            onClose={closeDrawer}
            open={open}
            closable={screens.sm ? false : true}
            width={"500px"}
          >
            <QueryClientWrapper>
              <CartContainer />
            </QueryClientWrapper>
          </Drawer>
        </Col>
        <Col
          xs={{ span: 4 }}
          sm={{ span: 2, offset: 1 }}
          lg={{ span: 2, offset: 0 }}
        >
          <Button
            type="text"
            style={{
              width: "100%",
              fontWeight: "bolder",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Col>
      </Row>
      <Divider style={{ marginTop: "20px" }} />
    </Sentry.ErrorBoundary>
  );
}

export default Navbar;
