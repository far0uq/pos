"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DiscountDropdown from "./DiscountDropdown";

const queryClient = new QueryClient();

function DiscountContainer() {

  return (
    <QueryClientProvider client={queryClient}>
      <DiscountDropdown />
    </QueryClientProvider>
  );
}

export default DiscountContainer;
