import { Client, Environment } from "square";
import { NextResponse } from "next/server";
import { Product } from "@/app/interface/ProductInterface";
import { CatalogObject } from "square";

export async function GET() {
  console.log("GET request received");
  try {
    const client = new Client({
      environment: Environment.Production,
      accessToken: process.env.NEXT_SERVER_ACCESS_TOKEN_PROD,
    });

    const resp = await client.catalogApi.listCatalog();
    const objects = resp.result.objects;

    if (objects) {
      const cleanedObjects = cleanProductObjects(objects);
      return NextResponse.json({ result: cleanedObjects }, { status: 200 });
    } else {
      return NextResponse.json({ result: [] }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { query } = req.json();
    const client = new Client({
      environment: Environment.Production,
      accessToken: process.env.NEXT_SERVER_ACCESS_TOKEN_PROD,
    });

    const resp = await client.catalogApi.searchCatalogItems({
      textFilter: query,
    });
    const objects = resp.result.items;
    if (objects) {
      const cleanedObjects = cleanProductObjects(objects);
      return NextResponse.json({ result: cleanedObjects }, { status: 200 });
    } else {
      return NextResponse.json({ result: [] }, { status: 200 });
    }
  } catch (error) {}
}

const cleanProductObjects = (objects: CatalogObject[]): Product[] => {
  const cleanedObjects: Product[] = [];
  objects.forEach((object) => {
    const cleanedPrice = object.itemData?.variations?.[0]?.itemVariationData
      ?.priceMoney?.amount
      ? Number(
          object.itemData.variations[0].itemVariationData.priceMoney.amount
        ) / 100
      : 0;
    cleanedObjects.push({
      id: object.id,
      name: object.itemData?.name as string,
      price: cleanedPrice,
      image: "https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b",
    });
  });
  return cleanedObjects;
};
