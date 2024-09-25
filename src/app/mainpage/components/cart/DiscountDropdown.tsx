import { Select } from "antd";
import React from "react";
import {
  DiscountOption,
  DiscountQuery,
} from "@/app/interface/DiscountInterface";
import { useTotalStore } from "@/app/store/store";

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
  discounts,
  productID,
  mutate,
}: {
  discounts: DiscountQuery;
  productID: string;
  mutate: () => void;
}) {
  const addDiscount = useTotalStore((state) => state.addDiscount);
  const removeDiscount = useTotalStore((state) => state.removeDiscount);

  const handleAddDiscount = (value: string) => {
    addDiscount(value, productID);
  };

  const handleRemoveDiscount = (value: string) => {
    removeDiscount(value, productID);
  };

  return (
    <div>
      <Select
        mode="multiple"
        placeholder={
          discounts.discountsAreError
            ? "Failed to fetch discounts"
            : discounts.discountsAreLoading
            ? "Loading discounts..."
            : "Select discounts"
        }
        defaultValue={[]}
        style={{ width: "100%" }}
        loading={discounts.discountsAreLoading}
        disabled={discounts.discountsAreError ? true : false}
        options={
          discounts.discountsAreLoading
            ? loadingOptions
            : discounts.discountsData && discounts.discountsData.length > 0
            ? (discounts.discountsData as DiscountOption[])
            : noDiscountsOptions
        }
        onChange={() => mutate()}
        onSelect={handleAddDiscount}
        onDeselect={handleRemoveDiscount}
      />
    </div>
  );
}

export default DiscountDropdown;
