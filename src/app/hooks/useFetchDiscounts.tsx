import { useQuery } from "@tanstack/react-query";
import { Discount, DiscountOption } from "../interface/DiscountInterface";

export const useFetchDiscounts = () => {
  const cleanDiscounts = (discounts: Discount[]): DiscountOption[] => {
    const cleanedDiscounts = discounts.map((discount) => ({
      value: discount.id,
      label: discount.name,
    }));
    return cleanedDiscounts;
  };

  const handleFetchDiscounts = async () => {
    // No try catch as we want tanstack to handle it
    const resp = await fetch("/api/discountsAPI", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { result } = await resp.json();
    if (resp.status === 200) {
      const cleanedDiscounts = cleanDiscounts(result);
      return cleanedDiscounts;
    }
    throw new Error("Failed to fetch discounts in client");
  };

  const {
    data: discountsData,
    error: discountsError,
    isError: discountsAreError,
    isLoading: discountsAreLoading,
  } = useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchDiscounts,
  });

  return {
    discountsData,
    discountsError,
    discountsAreError,
    discountsAreLoading,
  };
};
