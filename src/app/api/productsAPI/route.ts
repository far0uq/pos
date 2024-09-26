import { NextResponse } from "next/server";
import { cleanProductObjects } from "./utils/productHelper";

export async function POST(req: Request) {
  console.log("POST request received");
  try {
    const accessToken = process.env.NEXT_SERVER_JWT_TEST as string;

    let { query, category } = await req.json();
    const { searchParams } = new URL(req.url);
    let cursor = searchParams.get("pageParam") ?? "";
    query = query ?? "";
    category = category === "0" ? "" : category;

    const url = `http://localhost:5000/api/search-catalog-items?textFilter=${query}&categoryId=${category}&cursor=${cursor}`;
    console.log(url);

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
