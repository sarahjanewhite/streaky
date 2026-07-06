import { NextRequest, NextResponse } from "next/server";
import { getState, registerClick, Person } from "@/lib/streak";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getState();
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const person: Person | undefined = body?.person;

  if (person !== "me" && person !== "partner") {
    return NextResponse.json({ error: "invalid person" }, { status: 400 });
  }

  const state = await registerClick(person);
  return NextResponse.json(state);
}
