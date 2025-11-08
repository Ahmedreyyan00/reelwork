import { Suspense } from "react";

import { createSupabaseServerClient } from "@/lib/supabase";
import { getMuxAsset, getMuxUpload } from "@/lib/mux";
import { FeedViewer } from "./viewer";

type FeedVideo = {
  uploadId: string;
  playbackId: string;
  duration: number | null;
  createdAt: string;
};

async function fetchFeedVideos(): Promise<FeedVideo[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("video_uploads")
    .select("stream_uid, status, created_at")
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    console.error("[feed] Failed to load videos", error);
    return [];
  }

  const uploads = data ?? [];

  const videos: FeedVideo[] = [];

  for (const upload of uploads) {
    const muxUpload = await getMuxUpload(upload.stream_uid);
    const muxAssetId = muxUpload?.data?.asset_id ?? null;

    if (!muxAssetId) continue;

    const muxAsset = await getMuxAsset(muxAssetId);
    const playbackId = muxAsset?.data?.playback_ids?.[0]?.id ?? null;
    if (!playbackId) continue;

    videos.push({
      uploadId: upload.stream_uid,
      playbackId,
      duration: muxAsset?.data?.duration ?? null,
      createdAt: upload.created_at,
    });
  }

  return videos;
}

export default async function FeedPage() {
  const videos = await fetchFeedVideos();

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Suspense fallback={<div className="p-6 text-center">Loading feed…</div>}>
        <FeedViewer videos={videos} />
      </Suspense>
    </main>
  );
}

