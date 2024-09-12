"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaxDropdown from "./TaxDropdown";

const queryClient = new QueryClient();

function TaxContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <TaxDropdown />
    </QueryClientProvider>
  );
}

export default TaxContainer;
