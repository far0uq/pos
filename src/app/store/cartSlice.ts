import {  StateCreator } from "zustand";
import { Product } from "../interface/ProductInterface";
import { TaxID, ProductID, DiscountID } from "../interface/CartInterface";

interface CartState {
  cartProducts: Product[];
  quantityCounts: Map<ProductID, number>;
  cartLength: number;
  taxes: Set<TaxID>;
  discounts: Map<DiscountID, number>;
  itemDiscountRecord: Map<ProductID, DiscountID[]>;
}

interface CartActions {
  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => Map<ProductID, number>;
  decreaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => Map<ProductID, number>;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  addTax: (taxID: TaxID) => void;
  removeTax: (taxID: TaxID) => void;
  addDiscount: (discountID: string, productID: string) => void;
  removeDiscount: (discountID: string, productID: string) => void;
  clearCart: () => void;
}

export interface CartSlice extends CartState, CartActions {}

export const createCartStore: StateCreator<CartSlice> = (set, get) => ({
  cartProducts: [],
  cartLength: 0,
  quantityCounts: new Map<ProductID, number>(),
  taxes: new Set(),
  itemTaxRecord: new Map<ProductID, TaxID[]>(),
  discounts: new Map<DiscountID, number>(),
  itemDiscountRecord: new Map<ProductID, DiscountID[]>(),

  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => {
    const updatedQuantity = new Map([...oldQuantityCounts]);
    if (updatedQuantity.has(productID)) {
      const currentQuantity = updatedQuantity.get(productID) as number;
      updatedQuantity.set(productID, currentQuantity + 1);
    } else {
      updatedQuantity.set(productID, 1);
    }

    return updatedQuantity;
  },

  decreaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<ProductID, number>
  ) => {
    const updatedQuantity = new Map([...oldQuantityCounts]);
    const currentQuantity = updatedQuantity.get(productID) as number;
    if (currentQuantity > 1) {
      updatedQuantity.set(productID, currentQuantity - 1);
    } else {
      updatedQuantity.delete(productID);
    }

    return updatedQuantity;
  },

  addProduct: (product: Product) =>
    set((state) => {
      const { increaseProductQuantity } = get();
      const updatedQuantity = increaseProductQuantity(
        product.id,
        state.quantityCounts
      );
      if (state.quantityCounts.has(product.id)) {
        return {
          cartProducts: state.cartProducts,
          cartLength: state.cartLength + 1,
          quantityCounts: updatedQuantity,
        };
      } else {
        return {
          cartProducts: [...state.cartProducts, product],
          cartLength: state.cartLength + 1,
          quantityCounts: updatedQuantity,
        };
      }
    }),

  removeProduct: (product: Product) => {
    set((state) => {
      const { decreaseProductQuantity } = get();
      const updatedQuantity = decreaseProductQuantity(
        product.id,
        state.quantityCounts
      );

      if (updatedQuantity.has(product.id)) {
        return {
          cartProducts: state.cartProducts,
          cartLength: state.cartLength - 1,
          quantityCounts: updatedQuantity,
        };
      } else {
        return {
          cartProducts: state.cartProducts.filter((p) => p.id !== product.id),
          cartLength: state.cartLength - 1,
          quantityCounts: updatedQuantity,
        };
      }
    });
  },

  addTax(taxID: string) {
    set((state) => {
      if (!state.taxes.has(taxID)) {
        const updatedTaxes = new Set(state.taxes);
        updatedTaxes.add(taxID);
        return {
          taxes: updatedTaxes,
        };
      }
      return {
        taxes: state.taxes,
      };
    });
  },

  removeTax(taxID: string) {
    set((state) => {
      if (state.taxes.has(taxID)) {
        const updatedTaxes = new Set(state.taxes);
        updatedTaxes.delete(taxID);
        return {
          taxes: updatedTaxes,
        };
      }
      return {
        taxes: state.taxes,
      };
    });
  },

  addDiscount(discountID: string, productID: string) {
    set((state) => {
      const thisDiscountExists = state.discounts.has(productID);
      const updatedDiscounts = new Map([...state.discounts]);
      if (!thisDiscountExists) {
        updatedDiscounts.set(discountID, 1);
      } else {
        const currentDiscount = updatedDiscounts.get(discountID) as number;
        updatedDiscounts.set(discountID, currentDiscount + 1);
      }

      const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
      const oldDiscountIDs = updatedDiscountRecord.get(productID) || [];
      updatedDiscountRecord.set(productID, [...oldDiscountIDs, discountID]);

      return {
        discounts: updatedDiscounts,
        itemDiscountRecord: updatedDiscountRecord,
      };
    });
  },

  removeDiscount(discountID: string, productID: string) {
    set((state) => {
      const updatedDiscounts = new Map([...state.discounts]);
      const currentDiscount = updatedDiscounts.get(discountID) as number;
      if (currentDiscount > 1) {
        updatedDiscounts.set(discountID, currentDiscount - 1);
      } else {
        updatedDiscounts.delete(discountID);
      }

      const updatedDiscountRecord = new Map([...state.itemDiscountRecord]);
      const oldDiscountIDs = updatedDiscountRecord.get(productID) || [];
      const newDiscountIDs = oldDiscountIDs.filter((id) => id !== discountID);
      updatedDiscountRecord.set(productID, newDiscountIDs);

      return {
        discounts: updatedDiscounts,
        itemDiscountRecord: updatedDiscountRecord,
      };
    });
  },

  clearCart: () =>
    set({
      cartProducts: [],
      cartLength: 0,
      quantityCounts: new Map<string, number>(),
    }),
});
