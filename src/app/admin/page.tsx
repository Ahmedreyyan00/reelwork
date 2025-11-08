import { createSupabaseServerClient } from "@/lib/supabase";
import { getMuxAsset, getMuxUpload } from "@/lib/mux";
import { AdminVideoCard } from "./video-card";

export type AdminVideo = {
  uploadId: string;
  status: string;
  createdAt: string;
  candidateId: string | null;
  playbackId: string | null;
  muxStatus: string | null;
  duration: number | null;
};

async function fetchAdminVideos(): Promise<AdminVideo[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("video_uploads")
    .select("stream_uid, status, candidate_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[admin] Failed to load video uploads", error);
    return [];
  }

  const uploads = data ?? [];

  const adminVideos = await Promise.all(
    uploads.map(async (upload) => {
      const muxUpload = await getMuxUpload(upload.stream_uid);
      const muxAssetId = muxUpload?.data?.asset_id ?? null;
      let playbackId: string | null = null;
      let muxStatus: string | null = muxUpload?.data?.status ?? null;
      let duration: number | null = null;

      if (muxAssetId) {
        const muxAsset = await getMuxAsset(muxAssetId);
        muxStatus = muxAsset?.data?.status ?? muxStatus;
        playbackId = muxAsset?.data?.playback_ids?.[0]?.id ?? null;
        duration = muxAsset?.data?.duration ?? null;
      }

      return {
        uploadId: upload.stream_uid,
        status: upload.status,
        createdAt: upload.created_at,
        candidateId: upload.candidate_id,
        playbackId,
        muxStatus,
        duration,
      } satisfies AdminVideo;
    })
  );

  return adminVideos;
}

export default async function AdminPage() {
  const videos = await fetchAdminVideos();

  if (!videos.length) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              ReelWork Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Video Moderation</h1>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              No videos found. Once candidates upload, you can review them here.
            </p>
          </header>
        </div>
      </main>
    );
  }

  const missingAuth = videos.every((video) => video.playbackId === null);

  if (missingAuth) {
    console.warn(
      "[admin] Mux playback IDs not available. Check MUX_TOKEN_ID / MUX_TOKEN_SECRET permissions."
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              ReelWork Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Video Moderation</h1>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              Swipe-style review feed for the latest candidate uploads. Videos
              auto-play on hover; use them to quickly moderate and tag
              submissions.
            </p>
          </div>
          <div className="hidden text-right text-xs text-slate-400 sm:block">
            <p>Total uploads: {videos.length}</p>
            <p>
              Ready for review:{" "}
              {videos.filter((video) => video.muxStatus === "ready").length}
            </p>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <AdminVideoCard key={video.uploadId} video={video} />
          ))}
        </section>
      </div>
    </main>
  );
}

