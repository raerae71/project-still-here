import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { moderateMessage } from "../../../lib/moderate";

export async function GET() {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, text, name, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 }
    );
  }

  const { count, error: countError } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  if (countError) {
    return NextResponse.json(
      { error: "Unable to load message count." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    messages,
    count: count || 0
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const text = String(body.text || "").trim();
    const name = String(body.name || "anonymous").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    const status = moderateMessage(text);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        text,
        name: name || "anonymous",
        status
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Unable to submit message." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
      message: data
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
