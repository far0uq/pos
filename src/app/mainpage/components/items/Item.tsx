"use client";

import React from "react";
import { Card, Image, Grid } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/app/interface/ProductInterface";
import { useTotalStore } from "@/app/store/store";

const { Meta } = Card;
const { useBreakpoint } = Grid;

enum Quantity {
  increase = "add",
  decrease = "sub",
}

function Item({ item }: { item: Product }) {
  const screens = useBreakpoint();
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
          height={screens.lg ? "150px" : "300px"}
          src={item.image}
          alt="book"
          preview={false}
          style={{ objectFit: "cover" }}
        />
      }
    >
      <Meta
        title={item.price ? item.price : "Free"}
        description={`Quantity: ${quantityCount.get(item.id) ?? 0}`}
      />
    </Card>
  );
}

export default Item;
