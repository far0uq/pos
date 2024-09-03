"use client";
import React from "react";
import ItemContainer from "./components/ItemContainer";
import SearchBar from "./components/SearchBar";
import { Flex } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MainPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("0");

  return (
    <QueryClientProvider client={queryClient}>
      <Flex gap="large" style={{ width: "65%", margin: "auto" }} vertical>
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
