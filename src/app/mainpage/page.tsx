"use client";
import React from "react";
import ItemContainer from "./components/items/ItemContainer";
import SearchBar from "./components/SearchBar";
import { Flex, Grid } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const queryClient = new QueryClient();

function MainPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("0");

  const screens = useBreakpoint();

  return (
    <QueryClientProvider client={queryClient}>
      <Flex
        gap="large"
        style={{ width: screens.sm ? "65%" : "90%", margin: "auto" }}
        vertical
      >
        <SearchBar
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
        />
        <ItemContainer query={query} category={category} />
      </Flex>
    </QueryClientProvider>
  );
}

export default MainPage;
