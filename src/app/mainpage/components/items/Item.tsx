"use client";

import React, { useState } from "react";
import { Card, Image } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/app/interface/ProductInterface";
import { useTotalStore } from "@/app/store/store";

const { Meta } = Card;

enum Quantity {
  increase = "add",
  decrease = "sub",
}

function Item({ item }: { item: Product }) {
  const quantityCount = useTotalStore((state) => state.quantityCounts);
  const addProduct = useTotalStore((state) => state.addProduct);
  const removeProduct = useTotalStore((state) => state.removeProduct);

  const toggleQuantity = (type: string) => {
    if (type === "add") {
      addProduct(item);
    } else if (type === "sub") {
      removeProduct(item);
    }
  };


  return (
    <Card
      title={item.name}
      style={{ width: "100%" }}
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
      cover={
          <Image
            width={"100%"}
            height={"auto"}
            src={item.image}
            alt="game"
            preview={false}
          />      }
    >
      <Meta
        title={item.price ? item.price : "Free"}
        description={`Quantity: ${quantityCount.get(item.id) ?? 0}`}
      />
    </Card>
  );
}

export default Item;
