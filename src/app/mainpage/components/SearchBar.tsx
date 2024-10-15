import React, { useEffect } from "react";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Input, Select, Tooltip, Button, Form } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useFetchCategories } from "@/app/hooks/useFetchCategories";

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
  const [form] = Form.useForm();
  const { categories, fetchCategories } = useFetchCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  interface SearchFormat {
    query: string;
    category: string;
  }

  const handleSaveQuery = (values: SearchFormat) => {
    if (values.query !== query) {
      setQuery(values.query);
    }
    if (values.category !== category) setCategory(values.category);
  };

  return (
    <Form
      form={form}
      onFinish={handleSaveQuery}
      style={{
        marginTop: "20px",
      }}
    >
      <Row
        style={{ width: "100%", margin: "auto" }}
        gutter={{ xs: 7, sm: 7, lg: 7 }}
      >
        <Col xs={24} sm={15}>
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
        <Col xs={12} sm={{ span: 4, offset: 1 }} lg={{ span: 3, offset: 3 }}>
          <FormItem name="category">
            <Select
              defaultValue="Category"
              options={
                categories
                  ? [
                      {
                        value: "0",
                        label: "All Categories",
                      },
                      ...categories,
                    ]
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
        <Col xs={12} sm={4} lg={3}>
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
