import React from "react";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Input, Select, Tooltip } from "antd";

function SearchBar() {
  return (
    <Row style={{ width: "100%", margin: "auto" }}>
      <Col span={18}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          suffix={
            <Tooltip title="Search Up Particular Items">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
      </Col>
      <Col offset={2} span={4}>
        <Select
          defaultValue="0"
          options={[
            {
              value: "0",
              label: "Category",
            },
            {
              value: "1",
              label: "Price",
            },
            {
              value: "2",
              label: "Quantity",
            },
          ]}
          style={{ width: "100%" }}
        />
      </Col>
    </Row>
  );
}

export default SearchBar;
