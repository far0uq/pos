import { Client, Environment } from "square";
import { NextResponse } from "next/server";
import { Product, CatalogProductAPI } from "@/app/interface/ProductInterface";
import { CatalogObject } from "square";

const cleanProductObjects = (objects: CatalogProductAPI[]): Product[] => {
  const cleanedObjects: Product[] = [];
  objects.forEach((object) => {
    console.log(object);
    // const cleanedPrice = object.itemData?.variations?.[0]?.itemVariationData
    //   ?.priceMoney?.amount
    //   ? Number(
    //       object.itemData.variations[0].itemVariationData.priceMoney.amount
    //     ) / 100
    //   : 0;
    cleanedObjects.push({
      id: object.catalogObjectId,
      name: object.name,
      price: object.variations[0]?.price?.amount ?? 0,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
    });
  });
  return cleanedObjects;
};

export async function GET(req: Request) {
  console.log("GET request received");
  try {
    const accessToken = process.env.NEXT_SERVER_JWT_TEST as string;
    const { searchParams } = new URL(req.url);
    let cursor = searchParams.get("pageParam");

    const url = `http://localhost:5000/api/search-catalog-items?cursor=${cursor}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    const { result } = await resp.json();

    const objects = result.items;
    cursor = result.cursor === "" ? null : result.cursor;

    if (objects) {
      const cleanedObjects = cleanProductObjects(objects);
      return NextResponse.json(
        { result: cleanedObjects, cursor },
        { status: 200 }
      );
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

    const { query, category } = await req.json();
    const { searchParams } = new URL(req.url);
    let cursor = searchParams.get("pageParam") ?? "";

    const url = `http://localhost:5000/api/search-catalog-items?textFilter=${query}&categoryId=${category}&cursor=${cursor}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    const { result } = await resp.json();
    cursor = result.cursor === "" ? null : result.cursor;

    const objects = result.items;

    if (objects) {
      const cleanedObjects = cleanProductObjects(objects);
      return NextResponse.json(
        { result: cleanedObjects, cursor },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ result: [] }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
