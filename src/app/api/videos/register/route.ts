import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase";

type RequestPayload = {
  assetId?: string;
  candidateId?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as RequestPayload;

  if (!payload.assetId) {
    return NextResponse.json(
      { error: "Missing assetId in request body." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    let { error } = await supabase.from("video_uploads").insert({
      stream_uid: payload.assetId,
      candidate_id: payload.candidateId ?? null,
      status: "pending",
    });

    if (error && error.message.includes("schema cache")) {
      await supabase.rpc("pg_notify", {
        channel: "postgrest",
        payload: "reload schema",
      });

      const warmup = await supabase
        .from("video_uploads")
        .select("id")
        .limit(1);

      error = warmup.error;

      if (!warmup.error) {
        const retry = await supabase.from("video_uploads").insert({
          stream_uid: payload.assetId,
          candidate_id: payload.candidateId ?? null,
          status: "pending",
        });
        error = retry.error ?? null;
      }
    }

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

