import { OrderState } from "../interface/OrderInterface";
import { TaxID, ProductID, DiscountID } from "../interface/CartInterface";

const getOrderObject = (
  taxes: Set<TaxID>,
  discounts: Map<DiscountID, number>,
  itemDiscountRecord: Map<ProductID, DiscountID[]>,
  quantityCounts: Map<ProductID, number>
) => {
  const taxesArray = Array.from(taxes);
  const refinedTaxes = Array.from(
    taxesArray.map((taxID) => {
      return {
        uid: taxID,
        scope: "ORDER",
        catalogObjectId: taxID,
      };
    })
  );

  const discountsArray = Array.from(discounts);
  const refinedDiscounts = discountsArray.map((discount) => {
    const discountID = discount[0];
    return {
      uid: discountID,
      scope: "LINE_ITEM",
      catalogObjectId: discountID,
    };
  });

  const quantityCountsArray = Array.from(quantityCounts);

  const refinedLineItems = quantityCountsArray.map((lineItem) => {
    const lineItemID = lineItem[0];
    const lineItemQuantity = lineItem[1];
    const lineItemDiscounts = itemDiscountRecord.get(lineItemID) ?? [];

    return {
      quantity: lineItemQuantity,
      catalogObjectId: lineItemID,
      itemType: "ITEM",
      appliedTaxes: "",
      appliedDiscounts: lineItemDiscounts.map((discount) => {
        return {
          discountUid: discount,
        };
      }),
    };
  });

  console.log(process.env.NEXT_PUBLIC_LOCATION_ID);
  return {
    locationId: process.env.NEXT_PUBLIC_LOCATION_ID,
    lineItems: refinedLineItems,
    taxes: refinedTaxes,
    discounts: refinedDiscounts,
  };
};

export const calculateOrder = async (orderInfo: OrderState) => {
  const order = getOrderObject(
    orderInfo.taxes,
    orderInfo.discounts,
    orderInfo.itemDiscountRecord,
    orderInfo.quantityCounts
  );

  console.log(order);

  try {
    const resp = await fetch("/api/cartAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    if (resp.status !== 200) {
      console.error("Error calculating order");
    }
    const { data } = await resp.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
