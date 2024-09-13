import { TaxOption, TaxQuery } from "@/app/interface/TaxInterface";
import { useTotalStore } from "@/app/store/store";
import { Select } from "antd";

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
  taxes,
  productID,
}: {
  taxes: TaxQuery;
  productID: string;
}) {
  const addTax = useTotalStore((state) => state.addTax);
  const removeTax = useTotalStore((state) => state.removeTax);

  const handleAddTax = (value: string) => {
    addTax(value, productID);
  };

  const handleRemoveTax = (value: string) => {
    removeTax(value, productID);
  };

  return (
    <div>
      <Select
        mode="multiple"
        placeholder={
          taxes.taxesAreError
            ? "Failed to fetch taxes"
            : taxes.taxesAreLoading
            ? "Loading taxes..."
            : "Select taxes"
        }
        defaultValue={[]}
        style={{ width: "100%" }}
        loading={taxes.taxesAreLoading}
        disabled={taxes.taxesAreError ? true : false}
        options={
          taxes.taxesAreLoading
            ? loadingOptions
            : taxes.taxesData && taxes.taxesData.length > 0
            ? (taxes.taxesData as TaxOption[])
            : noTaxesOptions
        }
        onSelect={handleAddTax}
        onDeselect={handleRemoveTax}
      />
    </div>
  );
}

export default TaxDropdown;
