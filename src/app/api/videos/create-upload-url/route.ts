import { NextResponse } from "next/server";

type MuxUploadResponse = {
  data: {
    id: string;
    created_at: string;
    new_asset_settings: {
      playback_policy: string[];
    };
    timeout: number;
    upload_url: string;
  };
};

export async function POST() {
  const muxTokenId = process.env.MUX_TOKEN_ID;
  const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!muxTokenId || !muxTokenSecret) {
    return NextResponse.json(
      {
        error:
          "Mux environment variables are missing. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET.",
      },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.mux.com/video/v1/uploads", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_asset_settings: {
        playback_policy: ["public"],
      },
      cors_origin: "*",
      timeout: 60,
    }),
  });

  const payload = (await response.json()) as MuxUploadResponse;

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Failed to generate Mux direct upload URL.",
        details: payload,
      },
      { status: 502 }
    );
  }

  const uploadUrl =
    payload?.data?.upload_url ??
    // some Mux responses use `url` for the temporary upload link
    // depending on account features.
    (payload?.data as { url?: string })?.url ??
    null;

  if (!uploadUrl) {
    return NextResponse.json(
      {
        error: "Mux response did not include an upload URL.",
        details: payload,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    uploadURL: uploadUrl,
    assetId: payload.data.id,
  });
}

