"use client";
import React from "react";
import Item from "./Item";
import { Flex } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/app/interface/ProductInterface";
import ItemsLoading from "./loading/ItemsLoading";

function ItemContainer({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  console.log("ITEMCONTAINER", query);
  const handleCallProductAPI = async () => {
    console.log("IN PRODUCT CALL");
    if (query) {
      const resp = await fetch("/api/productsAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          category: category,
        }),
      });
      return await resp.json();
    } else {
      const resp = await fetch("/api/productsAPI", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await resp.json();
    }
  };
  const { isPending, error, data } = useQuery({
    queryKey: [query],
    queryFn: handleCallProductAPI,
  });

  if (isPending) return <ItemsLoading />;
  if (error) return <div>Error: {error.message}</div>;
  else {
    console.log(data);
  }
  return (
    <Flex wrap gap="large" style={{ width: "fit-content" }}>
      {data.result.map((item: Product) => (
        <Item key={item.id} item={item} />
      ))}
    </Flex>
  );
}

export default ItemContainer;
