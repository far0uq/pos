import { Select } from "antd";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { handleFetchDiscounts } from "@/app/clientAPI/discountAPI";
import { DiscountOption } from "@/app/interface/DiscountInterface";

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

function DiscountDropdown() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchDiscounts,
  });

  return (
    <div>
      <Select
        mode="multiple"
        placeholder={
          isError
            ? "Failed to fetch discounts"
            : isLoading
            ? "Loading discounts..."
            : "Select discounts"
        }
        defaultValue={[]}
        style={{ width: "100%" }}
        loading={isLoading}
        disabled={isError ? true : false}
        options={
          isLoading
            ? loadingOptions
            : data && data.length > 0
            ? (data as DiscountOption[])
            : noDiscountsOptions
        }
      />
    </div>
  );
}

export default DiscountDropdown;
