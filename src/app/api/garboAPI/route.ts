import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { dump } = await req.json();
  console.log(dump);
  return NextResponse.json({ message: dump }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { message: "Welcome to Deuceland!!" },
    { status: 200 }
  );
}
