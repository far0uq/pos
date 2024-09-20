"use client";
import CartItem from "./CartItem";
import { Card, Flex, Empty, Button } from "antd";
import React from "react";
import { useTotalStore } from "@/app/store/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleFetchDiscounts } from "@/app/clientAPI/discountAPI";
import { handleFetchTaxes } from "@/app/clientAPI/taxAPI";
import { DiscountQuery } from "@/app/interface/DiscountInterface";
import { TaxQuery } from "@/app/interface/TaxInterface";
import { calculateOrder } from "../../../clientAPI/orderAPI";
import TaxDropdown from "./TaxDropdown";
import {
  OrderState,
  LineItemResponse,
  LineItemResponseCleaned,
} from "@/app/interface/OrderInterface";
import TotalPaymentInfo from "./TotalPaymentInfo";

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
    return calculateOrder(orderInfo);
  };

  const mutation = useMutation({
    mutationFn: () => handleCalculateOrder(),
  });

  const getProductLineItem = (productID: string) => {
    if (mutation.data) {
      const foundData = mutation.data.lineItemDetails.find(
        (lineItem: LineItemResponse) => lineItem.uid === productID
      );
      return foundData;
    }
  };

  console.log("CART CONTAINER");
  return (
    <div>
      {products.length > 0 ? (
        <Flex vertical gap="large">
          {products.map((product) => {
            const productMoneyDetails = getProductLineItem(product.id);
            console.log(productMoneyDetails);

            return (
              <CartItem
                key={product.id}
                item={product}
                itemQuantity={quantityCounts.get(product.id) ?? 0}
                discounts={discountQuery}
                individualCost={productMoneyDetails as LineItemResponseCleaned}
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
              <TaxDropdown taxes={taxQuery} />

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
