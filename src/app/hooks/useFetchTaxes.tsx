import { useQuery } from "@tanstack/react-query";
import { Tax, TaxOption } from "../interface/TaxInterface";

export const useFetchTaxes = () => {
  const cleanTaxes = (taxes: Tax[]): TaxOption[] => {
    const cleanedTaxes = taxes.map((tax) => ({
      value: tax.id,
      label: tax.name,
    }));
    return cleanedTaxes;
  };

  const handleFetchTaxes = async () => {
    // No try catch as we want tanstack to handle it
    const resp = await fetch("/api/taxAPI", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { result } = await resp.json();
    if (resp.status === 200) {
      const cleanedTaxes = cleanTaxes(result);
      return cleanedTaxes;
    }
    throw new Error("Failed to fetch tax in client");
  };

  const {
    data: taxesData,
    error: taxesError,
    isError: taxesAreError,
    isLoading: taxesAreLoading,
  } = useQuery({
    queryKey: ["taxes"],
    queryFn: handleFetchTaxes,
  });

  return { taxesData, taxesError, taxesAreError, taxesAreLoading };
};
