import React from "react";
import Image from "next/image";
import { Button, Divider, Row, Col } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import WebsiteLogo from "./doryabooks.svg";

function Navbar() {
  return (
    <>
      <Row style={{ width: "65%", margin: "20px auto auto auto" }}>
        <Col xs={12} sm={8} lg={10}>
          <Image
            style={{ paddingTop: "10px" }}
            width={230}
            src={WebsiteLogo}
            alt="Logo"
          />
        </Col>
        <Col
          xs={{ span: 4, offset: 4 }}
          sm={{ span: 2, offset: 11 }}
          lg={{ span: 1, offset: 11 }}
        >
          <Button type="text" style={{ width: "100%" }}>
            <ShoppingCartOutlined
              style={{
                fontSize: 30,
              }}
            />
          </Button>
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
          >
            Logout
          </Button>
        </Col>
      </Row>
      <Divider style={{ marginTop: "20px" }} />
    </>
  );
}

export default Navbar;
