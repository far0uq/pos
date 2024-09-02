"use client";
import React from "react";
import ItemContainer from "./components/ItemContainer";
import SearchBar from "./components/SearchBar";
import { Flex } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MainPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Flex gap="large" style={{ width: "65%", margin: "auto" }} vertical>
        <SearchBar />
        <ItemContainer />
      </Flex>
    </QueryClientProvider>
  );
}

export default MainPage;
