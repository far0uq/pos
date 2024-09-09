import { Client, Environment } from "square";
import { NextResponse } from "next/server";
import { Product, CatalogProductAPI } from "@/app/interface/ProductInterface";
import { CatalogObject } from "square";

const cleanProductObjects = (objects: CatalogProductAPI[]): Product[] => {
  const cleanedObjects: Product[] = [];
  objects.forEach((object) => {
    // const cleanedPrice = object.itemData?.variations?.[0]?.itemVariationData
    //   ?.priceMoney?.amount
    //   ? Number(
    //       object.itemData.variations[0].itemVariationData.priceMoney.amount
    //     ) / 100
    //   : 0;
    cleanedObjects.push({
      id: object.catalogObjectId,
      name: object.name,
      price: object.variations[0].price.amount,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
    });
  });
  return cleanedObjects;
};

export async function GET() {
  console.log("GET request received");
  try {
    const accessToken = process.env.NEXT_SERVER_JWT_TEST as string;

    const url = "http://localhost:5000/api/search-catalog-items";

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    const { result } = await resp.json();

    const objects = result.items;

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
  console.log("POST request received");
  try {
    const accessToken = process.env.NEXT_SERVER_JWT_TEST as string;

    const { query } = await req.json();

    const url = `http://localhost:5000/api/search-catalog-items?textFilter=${query}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    const { result } = await resp.json();

    const objects = result.items;

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
