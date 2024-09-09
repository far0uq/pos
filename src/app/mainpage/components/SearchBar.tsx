import React, { useEffect, useState } from "react";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Input, Select, Tooltip, Button, Form } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useQuery } from "@tanstack/react-query";

function SearchBar({
  query,
  setQuery,
  category,
  setCategory,
}: {
  query: string;
  setQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
}) {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const resp = await fetch("/api/categoriesAPI", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await resp.json();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  interface SearchFormat {
    query: string;
    category: string;
  }

  const handleSaveQuery = (values: SearchFormat) => {
    console.log(values);
    if (values.query !== query) {
      setQuery(values.query);
      console.log("Setting query");
    }
    if (values.category !== category) setCategory(values.category);
  };

  return (
    <Form form={form} onFinish={handleSaveQuery}>
      <Row style={{ width: "100%", margin: "auto" }}>
        <Col span={15}>
          <FormItem name="query">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              suffix={
                <Tooltip title="Search Up Particular Items">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </FormItem>
        </Col>
        <Col offset={2} span={3}>
          <FormItem name="category">
            <Select
              defaultValue="Category"
              options={
                categories
                  ? categories
                  : [
                      {
                        value: "loading",
                        label: "Loading Categories...",
                      },
                    ]
              }
              style={{ width: "100%" }}
            />
          </FormItem>
        </Col>
        <Col offset={1} span={3}>
          <FormItem>
            <Button type="primary" style={{ width: "100%" }} htmlType="submit">
              Search
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
