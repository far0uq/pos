"use client";
import React, { useEffect } from "react";

import { Empty, Flex, Grid } from "antd";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import Item from "./Item";
import { Product, ProductGroup } from "@/app/interface/ProductInterface";
import { handleFetchProducts } from "@/app/clientAPI/productAPI";
import ItemsLoading from "../loading/ItemsLoading";

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

  const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["products", query, category],
    queryFn: handleFetchProducts,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isPending) return <ItemsLoading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Flex wrap gap={screens.lg ? "2%" : "0%"} style={{ width: "100%" }}>
      {data && data.pages[0].result && data.pages[0].result.length > 0 ? (
        data.pages.map((group: ProductGroup, groupIndex: number) =>
          group.result.map((item: Product, itemIndex: number) => {
            const isLastItem =
              groupIndex === data.pages.length - 1 &&
              itemIndex === group.result.length - 1;
            return (
              <div
                key={item.id}
                style={{
                  width: screens.lg ? "18%" : "100%",
                  marginTop: "20px",
                }}
                ref={isLastItem ? ref : null}
              >
                <Item item={item} />
              </div>
            );
          })
        )
      ) : (
        <Empty style={{ width: "100%", marginTop: "22vh" }} />
      )}
      {isFetchingNextPage ? <ItemsLoading /> : null}
    </Flex>
  );
}

export default ItemContainer;
