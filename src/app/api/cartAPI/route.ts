import { NextResponse } from "next/server";
import {
  LineItemResponse,
  LineItemResponseCleaned,
  OrderResponse,
} from "@/app/interface/OrderInterface";
import { getTokenFromSession } from "@/app/api/authTokenAPI/utils/getTokenFromSession";
import { tokenTypes } from "../../../../types/tokenTypes";

export async function POST(req: Request) {
  try {
    const token = await getTokenFromSession(tokenTypes.tokenTypeAPI);
    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const order = await req.json();

    const response = await fetch("http://localhost:5000/api/calculate-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(order),
    });

    const { result } = await response.json();
    if (response.status !== 200) {
      throw new Error(
        "Error calculating the order, check API. An Items price is variable."
      );
    }

    const lineItemDetails: LineItemResponseCleaned[] = result.lineItems.map(
      (lineItem: LineItemResponse) => {
        return {
          uid: lineItem.catalogObjectId,
          totalTaxMoney: lineItem.totalTaxMoney?.amount ?? 0,
          totalMoney: lineItem.totalMoney?.amount ?? 0,
          totalDiscountMoney: lineItem.totalDiscountMoney?.amount ?? 0,
        };
      }
    );

    const orderResponse: OrderResponse = {
      totalTaxMoney: result.totalTaxMoney?.amount ?? 0,
      totalDiscountMoney: result.totalDiscountMoney?.amount ?? 0,
      totalMoney: result.totalMoney?.amount,
    };

    return NextResponse.json(
      { data: { orderResponse, lineItemDetails } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
