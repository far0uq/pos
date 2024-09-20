import { Tax, TaxOption } from "../interface/TaxInterface";

const cleanTaxes = (taxes: Tax[]): TaxOption[] => {
  const cleanedTaxes = taxes.map((tax) => ({
    value: tax.id,
    label: tax.name,
  }));
  return cleanedTaxes;
};

export const handleFetchTaxes = async () => {
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
