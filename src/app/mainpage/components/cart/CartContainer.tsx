"use client";
import CartItem from "./CartItem";
import { Card, Flex, Empty, Button } from "antd";
import React from "react";
import { useTotalStore } from "@/app/store/store";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { handleFetchDiscounts } from "@/app/clientAPI/discountAPI";
import { handleFetchTaxes } from "@/app/clientAPI/taxAPI";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { TaxQuery } from "@/app/interface/TaxInterface";
import { calculateOrder } from "../../../clientAPI/orderAPI";
import TaxDropdown from "./TaxDropdown";
import {
  OrderState,
  OrderResponse,
  LineItemResponse,
} from "@/app/interface/OrderInterface";
import TotalPaymentInfo from "./TotalPaymentInfo";
import { TotalResponse } from "@/app/interface/OrderInterface";

function CartContainer() {
  const products = useTotalStore((state) => state.cartProducts);
  const quantityCounts = useTotalStore((state) => state.quantityCounts);
  const taxes = useTotalStore((state) => state.taxes);
  const discounts = useTotalStore((state) => state.discounts);
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
    const orderInfo: OrderState = {
      taxes,
      discounts,
      itemDiscountRecord,
      quantityCounts,
    };
    calculateOrder(orderInfo);
  };

  const { data, error, isLoading }: UseQueryResult<TotalResponse> = useQuery({
    queryKey: ["order"],
    queryFn: handleCalculateOrder,
  });

  const getProductLineItem = (productID: string) => {
    if (data) {
      const foundData = data.lineItemResponse.find(
        (lineItem) => lineItem.catalogObjectId === productID
      );
      return foundData;
    }
  };

  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => (
            <CartItem
              key={product.id}
              item={product}
              itemQuantity={quantityCounts.get(product.id) ?? 0}
              discounts={discountQuery}
              individualCost={
                getProductLineItem(product.id) as LineItemResponse
              }
            />
          ))}

          <Card>
            <Flex gap="large" vertical>
              <Button onClick={handleCalculateOrder} style={{ width: "100%" }}>
                Calculate Order
              </Button>
              <TaxDropdown taxes={taxQuery} />

              {error && <p>Error calculating order</p>}
              {isLoading && <p>Calculating order...</p>}
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
