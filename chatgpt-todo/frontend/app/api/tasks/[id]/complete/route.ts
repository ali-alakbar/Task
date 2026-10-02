import { NextRequest, NextResponse } from "next/server";
import { rails } from "@/lib/api";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    return NextResponse.json(await rails("/tasks/" + id + "/complete", { method: "POST" }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "failed" }, { status: 500 });
  }
}
