import { create, StateCreator } from "zustand";
import { Product } from "../interface/ProductInterface";

interface CartState {
  products: Product[];
}

interface CartActions {
  deleteAndPasteProducts: (products: Product[]) => void;
}

export interface CartSlice extends CartState, CartActions {}

export const createCartStore: StateCreator<CartSlice> = (set) => ({
  products: [],
  deleteAndPasteProducts: (products) => set({ products }),
});

// export const createCartStore = create<CartSlice>((set) => ({
//   products: [],
//   addProduct: (product) =>
//     set((state) => ({ products: [...state.products, product] })),
// }));
