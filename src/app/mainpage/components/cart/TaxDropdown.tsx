import {
  getCleanedModifierForItem,
  getCleanedModifierForTotal,
} from "@/app/clientAPI/modifiersAPI";
import { TaxOption, TaxQuery } from "@/app/interface/TaxInterface";
import { useTotalStore } from "@/app/store/store";
import { Select } from "antd";
import { modifierTypes } from "../../../../../types/modifierTypes";
import { useCallback, useEffect, useState } from "react";

const loadingOptions: TaxOption[] = [
  {
    value: "loading",
    label: "Loading taxes...",
  },
];

const noTaxesOptions: TaxOption[] = [
  {
    value: "no taxes",
    label: "No taxes available",
  },
];

function TaxDropdown({
  taxQuery,
  productID,
  refreshCart,
  dropDownType,
}: {
  taxQuery: TaxQuery;
  productID: string;
  refreshCart: () => void;
  dropDownType: "order" | "item";
}) {
  const addTax = useTotalStore((state) => state.addTax);
  const removeTax = useTotalStore((state) => state.removeTax);
  const taxNames = useTotalStore((state) => state.taxNames);
  const taxes = useTotalStore((state) => state.taxes);
  const itemTaxRecord = useTotalStore((state) => state.itemTaxRecord);
  const cartLength = useTotalStore((state) => state.cartLength);

  const [defaultValues, setDefaultValues] = useState<TaxOption[]>([]);

  const handleAddTax = (value: any) => {
    addTax(value.value, productID, dropDownType, value.label);
  };

  const handleRemoveTax = (value: any) => {
    removeTax(value.value, productID, dropDownType);
  };

  const getDefaultTaxes = useCallback(() => {
    if (dropDownType === modifierTypes.modifierTypeItem) {
      return getCleanedModifierForItem(productID, itemTaxRecord, taxNames);
    } else if (dropDownType === modifierTypes.modifierTypeOrder) {
      return getCleanedModifierForTotal(taxes, cartLength, taxNames);
    } else {
      return [];
    }
  }, [dropDownType, productID, itemTaxRecord, taxNames, taxes, cartLength]);

  useEffect(() => {
    const values = getDefaultTaxes();
    setDefaultValues(values);
  }, [itemTaxRecord, taxes, getDefaultTaxes]);

  return (
    <div>
      <Select
        labelInValue
        mode="multiple"
        placeholder={
          taxQuery.taxesAreError
            ? "Failed to fetch taxes"
            : taxQuery.taxesAreLoading
            ? "Loading taxes..."
            : "Select taxes"
        }
        defaultValue={[]}
        value={defaultValues}
        style={{ width: "100%" }}
        loading={taxQuery.taxesAreLoading}
        disabled={taxQuery.taxesAreError ? true : false}
        options={
          taxQuery.taxesAreLoading
            ? loadingOptions
            : taxQuery.taxesData && taxQuery.taxesData.length > 0
            ? (taxQuery.taxesData as TaxOption[])
            : noTaxesOptions
        }
        onChange={refreshCart}
        onSelect={handleAddTax}
        onDeselect={handleRemoveTax}
      />
    </div>
  );
}

export default TaxDropdown;
