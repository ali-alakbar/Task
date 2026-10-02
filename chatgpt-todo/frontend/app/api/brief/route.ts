import { NextResponse } from "next/server";
import { rails } from "@/lib/api";

export async function GET() {
  try {
    return NextResponse.json(await rails("/brief/daily?timezone=Baghdad"));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "failed" }, { status: 500 });
  }
}
