import { Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import {
  DiscountOption,
  DiscountQuery,
} from "@/app/interface/DiscountInterface";
import { useTotalStore } from "@/app/store/store";
import {
  getCleanedModifierForItem,
  getCleanedModifierForTotal,
} from "@/app/clientAPI/modifiersAPI";
import { modifierTypes } from "../../../../../types/modifierTypes";

const loadingOptions: DiscountOption[] = [
  {
    value: "loading",
    label: "Loading discounts...",
  },
];

const noDiscountsOptions: DiscountOption[] = [
  {
    value: "no discounts",
    label: "No discounts available",
  },
];

function DiscountDropdown({
  discountQuery,
  productID,
  refreshCart,
  dropDownType,
}: {
  discountQuery: DiscountQuery;
  productID: string;
  refreshCart: () => void;
  dropDownType: "order" | "item";
}) {
  const addDiscount = useTotalStore((state) => state.addDiscount);
  const removeDiscount = useTotalStore((state) => state.removeDiscount);
  const discountNames = useTotalStore((state) => state.discountNames);
  const discounts = useTotalStore((state) => state.discounts);
  const itemDiscountRecord = useTotalStore((state) => state.itemDiscountRecord);
  const cartLength = useTotalStore((state) => state.cartLength);

  const [defaultValues, setDefaultValues] = useState<DiscountOption[]>([]);

  const handleAddDiscount = (value: any) => {
    addDiscount(value.value, productID, dropDownType, value.label as string);
  };

  const handleRemoveDiscount = (value: any) => {
    removeDiscount(value.value, productID, dropDownType);
  };

  const getDefaultDiscounts = useCallback(() => {
    if (dropDownType === modifierTypes.modifierTypeItem) {
      return getCleanedModifierForItem(
        productID,
        itemDiscountRecord,
        discountNames
      );
    } else if (dropDownType === modifierTypes.modifierTypeOrder) {
      return getCleanedModifierForTotal(discounts, cartLength, discountNames);
    }
    return [];
  }, [
    itemDiscountRecord,
    discounts,
    cartLength,
    productID,
    discountNames,
    dropDownType,
  ]);

  useEffect(() => {
    const values = getDefaultDiscounts();
    setDefaultValues(values);
  }, [itemDiscountRecord, discounts, getDefaultDiscounts]);

  return (
    <div>
      <Select
        labelInValue
        mode="multiple"
        placeholder={
          discountQuery.discountsAreError
            ? "Failed to fetch discounts"
            : discountQuery.discountsAreLoading
            ? "Loading discounts..."
            : "Select discounts"
        }
        defaultValue={[]}
        value={defaultValues}
        style={{ width: "100%" }}
        loading={discountQuery.discountsAreLoading}
        disabled={discountQuery.discountsAreError ? true : false}
        options={
          discountQuery.discountsAreLoading
            ? loadingOptions
            : discountQuery.discountsData &&
              discountQuery.discountsData.length > 0
            ? (discountQuery.discountsData as DiscountOption[])
            : noDiscountsOptions
        }
        onChange={refreshCart}
        onSelect={handleAddDiscount}
        onDeselect={handleRemoveDiscount}
      />
    </div>
  );
}

export default DiscountDropdown;
