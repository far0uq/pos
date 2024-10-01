import { NextResponse } from "next/server";
import { formatCategories } from "./utils/categoryHelper";
import { getTokenFromSession } from "@/app/api/authTokenAPI/utils/getTokenFromSession";
import { tokenTypes } from "../../../../types/tokenTypes";

export async function GET() {
  try {
    const token = await getTokenFromSession(tokenTypes.tokenTypeAPI);
    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const response = await fetch("http://localhost:5000/api/list-categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
