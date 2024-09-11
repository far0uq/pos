import { extend } from "lodash";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CatalogProductAPI {
  catalogObjectId: string;
  name: string;
  variations: {
    price: {
      amount: number;
    };
  }[];
  image: string;
}

export interface ProductGroup {
  result: Product[];
  cursor: string;
}

export interface CartProduct extends Product {
  quantity: number;
}
