"use client";

import React, { useState } from "react";
import { Card, Image, Grid } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/app/interface/ProductInterface";

const { Meta } = Card;
const { useBreakpoint } = Grid;

enum Quantity {
  increase = "add",
  decrease = "sub",
}

function Item({
  item,
  ref,
}: {
  item: Product;
  ref?: (node?: Element | null) => void;
}) {
  const [quantity, setQuantity] = useState(0);
  const toggleQuantity = (type: string) => {
    if (type === "add") {
      setQuantity(quantity + 1);
    } else if (type === "sub") {
      quantity - 1 >= 0 && setQuantity(quantity - 1);
    }
  };

  const screens = useBreakpoint();

  return (
    <div
      ref={ref}
      style={{ width: screens.lg ? "18%" : "100%", marginTop: "20px" }}
    >
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
          screens.lg ? (
            <Image
              width={"100%"}
              height={"auto"}
              src={item.image}
              alt="game"
              preview={false}
            />
          ) : null
        }
      >
        <Meta
          title={item.price ? item.price : "Free"}
          description={`Quantity: ${quantity}`}
        />
      </Card>
    </div>
  );
}

export default Item;
