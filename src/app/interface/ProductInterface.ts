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
