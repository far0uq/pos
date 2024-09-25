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
  mutate,
}: {
  taxes: TaxQuery;
  mutate: () => void;
}) {
  const addTax = useTotalStore((state) => state.addTax);
  const removeTax = useTotalStore((state) => state.removeTax);

  const handleAddTax = (value: string) => {
    addTax(value);
  };

  const handleRemoveTax = (value: string) => {
    removeTax(value);
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
        onChange={mutate}
        onSelect={handleAddTax}
        onDeselect={handleRemoveTax}
      />
    </div>
  );
}

export default TaxDropdown;
