import { NextResponse } from "next/server";
import { getAllPropertiesFromDb } from "@/lib/firestore";

export async function GET() {
  try {
    const items = await getAllPropertiesFromDb();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("/api/properties error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
