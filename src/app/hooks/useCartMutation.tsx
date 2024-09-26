import { useMutation } from "@tanstack/react-query";
import { calculateOrder } from "@/app/clientAPI/orderAPI";
import { useTotalStore } from "@/app/store/store";
import { useEffect } from "react";

export const useCartMutation = (
  taxes: Set<string>,
  discounts: Map<string, number>,
  itemDiscountRecord: Map<string, string[]>,
  quantityCounts: Map<string, number>
) => {
  const { data, isError, isPending, mutate } = useMutation({
    mutationFn: () =>
      calculateOrder({
        taxes,
        discounts,
        itemDiscountRecord,
        quantityCounts,
      }),
  });

  return { data, isError, isPending, mutate };
};
