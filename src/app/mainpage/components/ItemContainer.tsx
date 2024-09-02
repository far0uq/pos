"use client";
import React from "react";
import Item from "./Item";
import { Flex } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Client, Environment } from "square";
import { Product } from "@/app/interface/ProductInterface";

function ItemContainer() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("/api/productsAPI", {
        method: "GET",
      }).then((res) => res.json()),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  else {
    console.log(data);
  }
  return (
    <Flex wrap gap="large" style={{ width: "fit-content" }}>
      {data.result.map((item:Product) => (
        <Item key={item.id} item={item} />
      ))}
    </Flex>
  );
}

export default ItemContainer;
