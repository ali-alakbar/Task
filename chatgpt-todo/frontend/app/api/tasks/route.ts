import { NextRequest, NextResponse } from "next/server";
import { rails } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    return NextResponse.json(await rails("/tasks" + query));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json(await rails("/tasks", { method: "POST", body: JSON.stringify({ task: body }) }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "failed" }, { status: 500 });
  }
}
