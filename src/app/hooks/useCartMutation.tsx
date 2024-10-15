import { useMutation } from "@tanstack/react-query";
import { calculateOrder } from "@/app/clientAPI/orderAPI";

export const useCartMutation = (
  cartLength: number,
  taxes: Map<string, number>,
  discounts: Map<string, number>,
  itemDiscountRecord: Map<string, string[]>,
  itemTaxRecord: Map<string, string[]>,
  quantityCounts: Map<string, number>
) => {
  const { data, isError, isPending, mutate } = useMutation({
    mutationFn: () =>
      calculateOrder({
        cartLength,
        taxes,
        discounts,
        itemDiscountRecord,
        itemTaxRecord,
        quantityCounts,
      }),
  });

  return { data, isError, isPending, mutate };
};
