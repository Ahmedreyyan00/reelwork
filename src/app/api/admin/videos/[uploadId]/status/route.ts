import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase";

const ALLOWED_STATUSES = new Set(["pending", "live", "needs_changes", "rejected"]);

type RequestPayload = {
  status?: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ uploadId: string }> }
) {
  const { uploadId } = await context.params;

  const payload = (await request.json().catch(() => ({}))) as RequestPayload;
  const status = payload.status;

  if (!status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      {
        error:
          "Invalid status. Allowed values: pending, live, needs_changes, rejected.",
      },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { error, data } = await supabase
    .from("video_uploads")
    .update({ status })
    .eq("stream_uid", uploadId)
    .select("stream_uid")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to update video status.",
        details: error.message,
      },
      { status: 502 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Video upload not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, status });
}

