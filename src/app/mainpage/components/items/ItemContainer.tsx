"use client";
import React from "react";
import Item from "./Item";
import { Empty, Flex, Grid } from "antd";
import { useEffect } from "react";
import { Product, ProductGroup } from "@/app/interface/ProductInterface";
import ItemsLoading from "../loading/ItemsLoading";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

const { useBreakpoint } = Grid;

function ItemContainer({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  const screens = useBreakpoint();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleCallProductAPI = async ({ pageParam }: { pageParam: string }) => {
    console.log(query);
    console.log(category);
    if ((query && query !== "") || category !== "0") {
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
      console.log(response);
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
    <Flex wrap gap={screens.lg ? "2%" : "0%"} style={{ width: "100%" }}>
      {data && data.pages[0].result && data.pages[0].result.length > 0 ? (
        data.pages.map((group: ProductGroup, groupIndex: number) =>
          group.result.map((item: Product, itemIndex: number) =>
            groupIndex === data.pages.length - 1 &&
            itemIndex === group.result.length - 1 ? (
              <div
                ref={ref}
                key={item.id}
                style={{
                  width: screens.lg ? "18%" : "100%",
                  marginTop: "20px",
                }}
              >
                <Item item={item} />
              </div>
            ) : (
              <div
                key={item.id}
                style={{
                  width: screens.lg ? "18%" : "100%",
                  marginTop: "20px",
                }}
              >
                <Item item={item} key={item.id} />
              </div>
            )
          )
        )
      ) : (
        <Empty />
      )}
      {isFetchingNextPage ? <ItemsLoading /> : null}
    </Flex>
  );
}

export default ItemContainer;
