"use client";
import CartItem from "./CartItem";
import { Card, Flex, Empty, Button } from "antd";
import React from "react";
import { useTotalStore } from "@/app/store/store";
import { useMutation } from "@tanstack/react-query";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { TaxQuery } from "@/app/interface/TaxInterface";
import { calculateOrder } from "../../../clientAPI/orderAPI";
import TaxDropdown from "./TaxDropdown";
import { LineItemResponseCleaned } from "@/app/interface/OrderInterface";
import TotalPaymentInfo from "./TotalPaymentInfo";
import { useFetchDiscounts } from "@/app/hooks/useFetchDiscounts";
import { useFetchTaxes } from "@/app/hooks/useFetchTaxes";
import { getProductMoneyDetails } from "@/app/clientAPI/productAPI";

function CartContainer() {
  const products = useTotalStore((state) => state.cartProducts);
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
  const itemDiscountRecord = useTotalStore((state) => state.itemDiscountRecord);

  const discountQuery: DiscountQuery = useFetchDiscounts();
  const taxQuery: TaxQuery = useFetchTaxes();

  const mutation = useMutation({
    mutationFn: () =>
      calculateOrder({
        taxes,
        discounts,
        itemDiscountRecord,
        quantityCounts,
      }),
  });

  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => {
            const productMoneyDetails = getProductMoneyDetails(
              product.id,
              mutation.data
            );

            return (
              <CartItem
                key={product.id}
                item={product}
                itemQuantity={quantityCounts.get(product.id) ?? 0}
                discounts={discountQuery}
                individualCost={productMoneyDetails as LineItemResponseCleaned}
                mutate={mutation.mutate}
              />
            );
          })}

          <Card>
            <Flex gap="large" vertical>
              <Button
                onClick={() => mutation.mutate()}
                style={{ width: "100%" }}
              >
                Calculate Order
              </Button>
              <TaxDropdown taxes={taxQuery} mutate={mutation.mutate} />

              {mutation.isError && <p>Error calculating order</p>}
              {mutation.isPending && <p>Calculating order...</p>}
              {mutation.data ? (
                <TotalPaymentInfo totalAll={mutation.data.orderResponse} />
              ) : null}
            </Flex>
          </Card>
        </Flex>
      ) : (
        <Empty style={{ marginTop: "40vh" }} description="No items in cart" />
      )}
    </div>
  );
}

export default CartContainer;
