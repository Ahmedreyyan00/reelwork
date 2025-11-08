import { NextResponse } from "next/server";

type CloudflareDirectUploadResponse = {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  result: {
    uid: string;
    playback: {
      hls: string;
      dash: string | null;
    };
    readyToStream: boolean;
    uploadURL: string;
  };
};

export async function POST() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_STREAM_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json(
      {
        error:
          "Cloudflare Stream environment variables are missing. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_TOKEN.",
      },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maxDurationSeconds: 60,
        allowedOrigins: ["*"],
        creator: "candidate",
        requireSignedURLs: false,
      }),
    }
  );

  const payload = (await response.json()) as CloudflareDirectUploadResponse;

  if (!response.ok || !payload.success) {
    return NextResponse.json(
      {
        error: "Failed to generate Cloudflare Stream direct upload URL.",
        details: payload.errors,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    uploadURL: payload.result.uploadURL,
    streamUID: payload.result.uid,
  });
}

