import { NextResponse } from "next/server";
import { getSession } from "./utils/sessionHelper";

export async function POST(req: Request) {
  try {
    const { authenticationCode } = await req.json();

    if (authenticationCode) {
      const url = `http://localhost:5000/api/access-token?code=${authenticationCode}`;
      const response = await fetch(url, {
        method: "GET",
      });

      const { result, success } = await response.json();

      if (!success) {
        throw new Error(
          "Tried but Failed to obtain token, Check the authentication code."
        );
      }

      // Save token in session here
      const session = await getSession();
      session.tokenForAPI = result.tokenForAPI;
      session.tokenForVerification = result.tokenForVerification;
      await session.save();

      console.log(session);

      return NextResponse.json(
        {
          data: {
            message: "Token obtained successfully",
          },
        },
        { status: 200 }
      );
      // Save data in server session here
    } else {
      throw new Error(
        "No authentication code provided. Check the request body."
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "GET",
    });

    const { result } = await response.json();
    return NextResponse.json({ url: result.url }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ status: 500, error });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ status: 500 });
  }
}
