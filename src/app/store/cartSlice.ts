import { create, StateCreator } from "zustand";
import { Product } from "../interface/ProductInterface";

interface CartState {
  cartProducts: Product[];
  quantityCounts: Map<string, number>;
  cartLength: number;
}

interface CartActions {
  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<string, number>
  ) => Map<string, number>;
  decreaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<string, number>
  ) => Map<string, number>;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  clearCart: () => void;
}

export interface CartSlice extends CartState, CartActions {}

export const createCartStore: StateCreator<CartSlice> = (set, get) => ({
  cartProducts: [],
  cartLength: 0,
  quantityCounts: new Map<string, number>(),

  increaseProductQuantity: (
    productID: string,
    oldQuantityCounts: Map<string, number>
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
    oldQuantityCounts: Map<string, number>
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

  clearCart: () =>
    set({
      cartProducts: [],
      cartLength: 0,
      quantityCounts: new Map<string, number>(),
    }),
});
