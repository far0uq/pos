import {
  OrderState,
  Order,
  AppliedDiscount,
  AppliedTax,
} from "../interface/OrderInterface";
import { TaxID, ProductID, DiscountID } from "../interface/CartInterface";

const getAppliedTaxes = (
  lineItemTaxes: TaxID[],
  taxes: Map<TaxID, number>,
  cartLength: number
) => {
  const appliedTaxes = [];
  for (let lineItemTax of lineItemTaxes) {
    const taxOnProducts = taxes.get(lineItemTax) as number;
    if (!(taxOnProducts === cartLength)) {
      appliedTaxes.push({
        taxUid: lineItemTax,
      });
    }
  }

  return appliedTaxes;
};

const getAppliedDiscounts = (
  lineItemDiscounts: DiscountID[],
  discounts: Map<DiscountID, number>,
  cartLength: number
) => {
  const appliedDiscounts = [];
  for (let lineItemDiscount of lineItemDiscounts) {
    const discountsOnProducts = discounts.get(lineItemDiscount) as number;
    if (!(discountsOnProducts === cartLength)) {
      appliedDiscounts.push({
        discountUid: lineItemDiscount,
      });
    }
  }

  return appliedDiscounts;
};

const getOrderObject = (
  cartLength: number,
  taxes: Map<TaxID, number>,
  discounts: Map<DiscountID, number>,
  itemTaxRecord: Map<ProductID, TaxID[]>,
  itemDiscountRecord: Map<ProductID, DiscountID[]>,
  quantityCounts: Map<ProductID, number>
): Order => {
  const taxesArray = Array.from(taxes);
  const refinedTaxes = taxesArray.map((tax) => {
    const taxID = tax[0];
    const taxOnProducts = tax[1];

    return {
      uid: taxID,
      scope: taxOnProducts === cartLength ? "ORDER" : "LINE_ITEM",
      catalogObjectId: taxID,
    };
  });

  const discountsArray = Array.from(discounts);
  const refinedDiscounts = discountsArray.map((discount) => {
    const discountID = discount[0];
    const discountsOnProducts = discount[1];

    return {
      uid: discountID,
      scope: discountsOnProducts === cartLength ? "ORDER" : "LINE_ITEM",
      catalogObjectId: discountID,
    };
  });

  const quantityCountsArray = Array.from(quantityCounts);

  const refinedLineItems = quantityCountsArray.map((lineItem) => {
    const lineItemID = lineItem[0];
    const lineItemQuantity = lineItem[1];
    const lineItemDiscounts = itemDiscountRecord.get(lineItemID) ?? [];
    const lineItemTaxes = itemTaxRecord.get(lineItemID) ?? [];

    return {
      quantity: lineItemQuantity.toString(),
      catalogObjectId: lineItemID,
      itemType: "ITEM",

      appliedTaxes: getAppliedTaxes(lineItemTaxes, taxes, cartLength),
      appliedDiscounts: getAppliedDiscounts(
        lineItemDiscounts,
        discounts,
        cartLength
      ),
    };
  });

  return {
    order: {
      locationId: process.env.NEXT_PUBLIC_LOCATION_ID as string,
      lineItems: refinedLineItems,
      taxes: refinedTaxes,
      discounts: refinedDiscounts,
    },
  };
};

export const calculateOrder = async (orderInfo: OrderState) => {
  const order = getOrderObject(
    orderInfo.cartLength,
    orderInfo.taxes,
    orderInfo.discounts,
    orderInfo.itemDiscountRecord,
    orderInfo.itemTaxRecord,
    orderInfo.quantityCounts
  );

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
