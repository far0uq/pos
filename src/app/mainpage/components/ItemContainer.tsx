"use client";
import React from "react";
import Item from "./Item";
import { Flex } from "antd";
import { useEffect } from "react";
import { Product, ProductGroup } from "@/app/interface/ProductInterface";
import ItemsLoading from "./loading/ItemsLoading";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

function ItemContainer({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleCallProductAPI = async ({ pageParam }: { pageParam: string }) => {
    console.log(query);
    console.log(category);
    if (query !== "" || category !== "0") {
      console.log("query or category");
      const resp = await fetch(`/api/productsAPI?pageParam=${pageParam}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          category: category,
        }),
      });
      const response = await resp.json();
      return response;
    } else {
      const resp = await fetch(`/api/productsAPI?pageParam=${pageParam}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await resp.json();
      console.log(response);
      return response;
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isPending,
  } = useInfiniteQuery({
    queryKey: [query, category],
    queryFn: handleCallProductAPI,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  if (isPending) return <ItemsLoading />;
  if (error) return <div>Error: {error.message}</div>;
  else {
    console.log(data);
  }
  return (
    <Flex wrap justify="space-between" style={{ width: "100%" }}>
      {data
        ? data.pages.map((group: ProductGroup, groupIndex: number) =>
            group && group.result
              ? group.result.map((item: Product, itemIndex: number) =>
                  groupIndex === data.pages.length - 1 &&
                  itemIndex === group.result.length - 1 ? (
                    // <div key={item.id} ref={ref} style={cardStyle}>
                    <Item item={item} key={item.id} ref={ref} />
                  ) : (
                    // </div>
                    // <div key={item.id} style={cardStyle}>
                    <Item item={item} key={item.id} />
                    // </div>
                  )
                )
              : null
          )
        : null}
      {isFetchingNextPage ? <ItemsLoading /> : null}
    </Flex>
  );
}

export default ItemContainer;
