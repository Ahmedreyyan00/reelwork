const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

if (!muxTokenId || !muxTokenSecret) {
  console.warn(
    "[mux] Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET. Admin video tools will not function."
  );
}

const authHeader =
  muxTokenId && muxTokenSecret
    ? "Basic " +
      Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString("base64")
    : null;

type MuxUpload = {
  data: {
    id: string;
    status: "waiting" | "asset_created" | "errored" | string;
    asset_id: string | null;
    error: { type: string; messages: string[] } | null;
    created_at: string;
    updated_at: string;
  };
};

type MuxAsset = {
  data: {
    id: string;
    status: "preparing" | "ready" | "errored" | string;
    duration: number | null;
    created_at: string;
    playback_ids: Array<{
      id: string;
      policy: "public" | "signed";
    }>;
  };
};

async function muxFetch<T>(path: string): Promise<T | null> {
  if (!authHeader) {
    return null;
  }

  const response = await fetch(`https://api.mux.com${path}`, {
    headers: {
      Authorization: authHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    const details = await response.text().catch(() => "");
    console.error(
      `[mux] Request failed: ${response.status} ${response.statusText} for ${path}`,
      details
    );
    return null;
  }

  return (await response.json()) as T;
}

export async function getMuxUpload(uploadId: string) {
  return muxFetch<MuxUpload>(`/video/v1/uploads/${uploadId}`);
}

export async function getMuxAsset(assetId: string) {
  return muxFetch<MuxAsset>(`/video/v1/assets/${assetId}`);
}

