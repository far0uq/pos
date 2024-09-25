import { NextResponse } from "next/server";
import { formatCategories } from "./utils/categoryHelper";

export async function GET() {
  try {
    const accessToken = process.env.NEXT_SERVER_JWT_TEST as string;
    const response = await fetch("http://localhost:5000/api/list-categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });
    const { result } = await response.json();
    const formattedCategories = formatCategories(result);

    return NextResponse.json({ data: formattedCategories }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ status: 500, error });
  }
}
