import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase";

type RequestPayload = {
  streamUID?: string;
  candidateId?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as RequestPayload;

  if (!payload.streamUID) {
    return NextResponse.json(
      { error: "Missing streamUID in request body." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.from("video_uploads").insert({
      stream_uid: payload.streamUID,
      candidate_id: payload.candidateId ?? null,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to persist video metadata to Supabase.",
          details: error.message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[videos/register] error", cause);
    return NextResponse.json(
      {
        error:
          cause instanceof Error
            ? cause.message
            : "Supabase client not configured.",
      },
      { status: 500 }
    );
  }
}

