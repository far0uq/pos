"use client";

import React from "react";
import { Card, Image } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/app/interface/ProductInterface";

const { Meta } = Card;

function Item({ item }: { item: Product }) {
  return (
    <Card
      title={item.name}
      style={{ width: 230 }}
      actions={[
        <MinusCircleOutlined key="minus" />,
        <PlusCircleOutlined key="add" />,
      ]}
      cover={<Image width={230} height={230} src={item.image} alt="game" />}
    >
      <Meta
        title={item.price ? item.price : "Free"}
        description="Quantity: 0"
      />
    </Card>
  );
}

export default Item;
