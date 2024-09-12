"use client";
import { CartProduct } from "@/app/interface/ProductInterface";
import CartItem from "./CartItem";
import { Card, Flex, Empty } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useTotalStore } from "@/app/store/store";

// const products: CartProduct[] = [
//   {
//     id: "1",
//     name: "Omitrix",
//     price: 100,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTerbpW-g_3tj9XylsZLQ-6yFDFKSSP4apXoQ&s",
//     quantity: 2,
//   },
// ];

function CartContainer() {
  const products = useTotalStore((state) => state.cartProducts);
  const quantities = useTotalStore((state) => state.quantityCounts);

  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => (
            <CartItem
              key={product.id}
              item={product}
              itemQuantity={quantities.get(product.id) ?? 0}
            />
          ))}
          <Card>
            <Flex justify="space-between">
              <Meta title="Total" />
              <p style={{ fontWeight: "bolder" }}>$ 10,620</p>
            </Flex>
          </Card>
        </Flex>
      ) : (
        <Empty style={{ marginTop: "40vh" }} description="No items in cart" />
      )}
    </div>
  );
}

export default CartContainer;
