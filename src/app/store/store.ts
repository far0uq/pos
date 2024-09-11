import { create } from "zustand";
import { createCartStore, CartSlice } from "./cartSlice";

export const useTotalStore = create<CartSlice>()((...a) => ({
    ...createCartStore(...a),
}));
