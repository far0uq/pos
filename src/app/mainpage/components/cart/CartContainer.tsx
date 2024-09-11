"use client";
import { CartProduct } from "@/app/interface/ProductInterface";
import CartItem from "./CartItem";
import {  Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";

const products: CartProduct[] = [
  {
    id: "1",
    name: "Omitrix",
    price: 100,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTerbpW-g_3tj9XylsZLQ-6yFDFKSSP4apXoQ&s",
    quantity: 2,
  },
  {
    id: "2",
    name: "Nemitrix",
    price: 200,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqXLojMGQcYuztaW2HkUZXrzb-kVjmmKYbaA&s",
    quantity: 2,
  },
  {
    id: "3",
    name: "Rero Cherry",
    price: 2030,
    image: "https://i.scdn.co/image/ab67616d0000b273995433e1d78fed434c838cd8",
    quantity: 2,
  },
  {
    id: "4",
    name: "Black Apple",
    price: 8290,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlve4ceHmG52PO2JmXz9M_L6KF-2UfdkEbCA&s",
    quantity: 2,
  },
];

function CartContainer() {
  return (
    <div>
      <Flex vertical gap="large">
        {products.map((product) => (
          <CartItem key={product.id} item={product} />
        ))}
        <Card>
          <Flex justify="space-between">
            <Meta title="Total" />
            <p style={{ fontWeight: "bolder" }}>$ 10,620</p>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}

export default CartContainer;
