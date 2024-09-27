import { NextResponse } from "next/server";
import { getTokenFromSession } from "@/app/api/authTokenAPI/utils/getTokenFromSession";
import { tokenTypes } from "../../../../types/tokenTypes";

export async function GET() {
  try {
    const token = await getTokenFromSession(tokenTypes.tokenTypeAPI);
    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const resp = await fetch(
      "http://localhost:5000/api/get-discounts?type=DISCOUNT",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const { success, result } = await resp.json();
    if (!success) {
      throw new Error("Failed to fetch discounts");
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
