"use client";
import CartItem from "./CartItem";
import { Card, Flex, Empty, Button } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useTotalStore } from "@/app/store/store";
import { useQuery } from "@tanstack/react-query";
import { handleFetchDiscounts } from "@/app/clientAPI/discountAPI";
import { handleFetchTaxes } from "@/app/clientAPI/taxAPI";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { TaxQuery } from "@/app/interface/TaxInterface";

function CartContainer() {
  const products = useTotalStore((state) => state.cartProducts);
  const quantities = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
  const itemTaxRecord = useTotalStore((state) => state.itemTaxRecord);
  const itemDiscountRecord = useTotalStore((state) => state.itemDiscountRecord);

  const {
    data: discountsData,
    error: discountsError,
    isError: discountsAreError,
    isLoading: discountsAreLoading,
  } = useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchDiscounts,
  });

  const {
    data: taxesData,
    error: taxesError,
    isError: taxesAreError,
    isLoading: taxesAreLoading,
  } = useQuery({
    queryKey: ["taxes"],
    queryFn: handleFetchTaxes,
  });

  const discountQuery: DiscountQuery = {
    discountsData,
    discountsError,
    discountsAreError,
    discountsAreLoading,
  };

  const taxQuery: TaxQuery = {
    taxesData,
    taxesError,
    taxesAreError,
    taxesAreLoading,
  };

  const handleCalculateOrder = () => {
    // Generating the Order object and passing it to the /calculate-order api
  };

  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => (
            <CartItem
              key={product.id}
              item={product}
              itemQuantity={quantities.get(product.id) ?? 0}
              taxes={taxQuery}
              discounts={discountQuery}
            />
          ))}

          <Card>
            <Button onClick={handleCalculateOrder}>Calculate Order</Button>
            <Flex justify="space-between">
              <Meta title="Total" />
              <p style={{ fontWeight: "bolder" }}>$ 10,620</p>
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
