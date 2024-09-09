"use client";

import React, { useState } from "react";
import { Card, Image } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/app/interface/ProductInterface";
const { Meta } = Card;

enum Quantity {
  increase = "add",
  decrease = "sub",
}

function Item({ item }: { item: Product }) {
  const [quantity, setQuantity] = useState(0);
  const toggleQuantity = (type: string) => {
    if (type === "add") {
      setQuantity(quantity + 1);
    } else if (type === "sub") {
      quantity - 1 >= 0 && setQuantity(quantity - 1);
    }
  };

  return (
    <Card
      title={item.name}
      style={{ width: 230 }}
      actions={[
        <MinusCircleOutlined
          key="minus"
          onClick={() => toggleQuantity(Quantity.decrease)}
        />,
        <PlusCircleOutlined
          key="add"
          onClick={() => toggleQuantity(Quantity.increase)}
        />,
      ]}
      cover={<Image width={230} height={230} src={item.image} alt="game" />}
    >
      <Meta
        title={item.price ? item.price : "Free"}
        description={`Quantity: ${quantity}`}
      />
    </Card>
  );
}

export default Item;
