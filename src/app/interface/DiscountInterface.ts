export interface Discount {
  id: string;
  name: string;
  discountType: string;
  percentage: number;
}

export interface DiscountOption {
  value: string;
  label: string;
}
