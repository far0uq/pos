import { DiscountID, ProductID, TaxID } from "./CartInterface";

export interface Order {
  locationId: string;
  lineItems: LineItem[];
  taxes: OrderTax[];
  discounts: OrderDiscount[];
}

export interface LineItem {
  quantity: string;
  catalogObjectId: string;
  itemType: string;
  appliedTaxes: AppliedTax[];
  appliedDiscounts: AppliedDiscount[];
}

export interface OrderTax {
  uid: string;
  scope: string;
  catalogObjectId: string;
}

export interface OrderDiscount {
  uid: string;
  scope: string;
  catalogObjectId: string;
}

export interface AppliedDiscount {
  discountUid: string;
}

export interface AppliedTax {
  taxUid: string;
}

export interface OrderResponse {
  totalTaxAmount: string;
  totalDiscountAmount: string;
  totalAmount: string;
}

export interface LineItemResponse {
  catalogObjectId: string;
  totalTaxMoney: Amount;
  totalDiscountMoney: Amount;
  totalMoney: Amount;
}

export interface Amount {
  amount: string;
}

export interface OrderState {
  taxes: Set<TaxID>;
  discounts: Map<DiscountID, number>;
  itemDiscountRecord: Map<ProductID, DiscountID[]>;
  quantityCounts: Map<ProductID, number>;
}

export interface TotalResponse {
  lineItemResponse: LineItemResponse[];
  orderResponse: OrderResponse;
}
