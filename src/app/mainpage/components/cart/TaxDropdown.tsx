import { handleFetchTaxes } from "@/app/clientAPI/taxAPI";
import { TaxOption } from "@/app/interface/TaxInterface";
import { useQuery } from "@tanstack/react-query";
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

function TaxDropdown() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchTaxes,
  });


  return (
    <div>
      <Select
        mode="multiple"
        placeholder={
          isError
            ? "Failed to fetch taxes"
            : isLoading
            ? "Loading taxes..."
            : "Select taxes"
        }
        defaultValue={[]}
        style={{ width: "100%" }}
        loading={isLoading}
        disabled={isError ? true : false}
        options={
          isLoading
            ? loadingOptions
            : data && data.length > 0
            ? (data as TaxOption[])
            : noTaxesOptions
        }
      />
    </div>
  );
}

export default TaxDropdown;
