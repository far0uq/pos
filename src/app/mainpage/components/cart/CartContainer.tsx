"use client";
import CartItem from "./CartItem";
import { Card, Flex, Empty } from "antd";
import React from "react";
import { useTotalStore } from "@/app/store/store";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { TaxQuery } from "@/app/interface/TaxInterface";
import TaxDropdown from "./TaxDropdown";
import { LineItemResponseCleaned } from "@/app/interface/OrderInterface";
import TotalPaymentInfo from "./TotalPaymentInfo";
import { useFetchDiscounts } from "@/app/hooks/useFetchDiscounts";
import { useFetchTaxes } from "@/app/hooks/useFetchTaxes";
import { getProductMoneyDetails } from "@/app/clientAPI/productAPI";
import { useCartMutation } from "@/app/hooks/useCartMutation";
import { useEffect } from "react";

function CartContainer() {
  const products = useTotalStore((state) => state.cartProducts);
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
  const itemDiscountRecord = useTotalStore((state) => state.itemDiscountRecord);

  const discountQuery: DiscountQuery = useFetchDiscounts();
  const taxQuery: TaxQuery = useFetchTaxes();

  const { data, isError, isPending, mutate } = useCartMutation(
    taxes,
    discounts,
    itemDiscountRecord,
    quantityCounts
  );

  useEffect(() => {
    mutate();
  }, [products, quantityCounts]);

  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => {
            const productMoneyDetails = getProductMoneyDetails(
              product.id,
              data
            );

            return (
              <CartItem
                key={product.id}
                item={product}
                itemQuantity={quantityCounts.get(product.id) ?? 0}
                discounts={discountQuery}
                individualCost={productMoneyDetails as LineItemResponseCleaned}
                refreshCart={mutate}
              />
            );
          })}

          <Card>
            <Flex gap="large" vertical>
              <TaxDropdown taxes={taxQuery} refreshCart={mutate} />

              {isError && <p>Error calculating order</p>}
              {isPending && <p>Calculating order...</p>}
              {data ? <TotalPaymentInfo totalAll={data.orderResponse} /> : null}
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
