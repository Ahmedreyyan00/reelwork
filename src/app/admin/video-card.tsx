"use client";

import { useCallback, useState, type MouseEvent } from "react";

import type { AdminVideo } from "./page";

type Props = {
  video: AdminVideo;
  onStatusChange?: (uploadId: string, status: string) => void;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  live: "Live",
  needs_changes: "Needs Changes",
  rejected: "Rejected",
};

const ACTIONS: Array<{
  label: string;
  value: AdminVideo["status"];
  tone: "default" | "positive" | "warning" | "danger";
}> = [
  { label: "Mark Live", value: "live", tone: "positive" },
  { label: "Request Changes", value: "needs_changes", tone: "warning" },
  { label: "Reject", value: "rejected", tone: "danger" },
];

export function AdminVideoCard({ video, onStatusChange }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [status, setStatus] = useState(video.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = useCallback((event: MouseEvent<HTMLVideoElement>) => {
    setIsHovering(true);
    event.currentTarget
      .play()
      .catch(() => {
        /* ignore autoplay issues */
      });
  }, []);

  const handleMouseLeave = useCallback((event: MouseEvent<HTMLVideoElement>) => {
    setIsHovering(false);
    event.currentTarget.pause();
    event.currentTarget.currentTime = 0;
  }, []);

  const handleStatusUpdate = useCallback(
    async (nextStatus: AdminVideo["status"]) => {
      if (status === nextStatus) return;
      setIsUpdating(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/admin/videos/${video.uploadId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: nextStatus }),
          }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Failed to update status.");
        }

        setStatus(nextStatus);
        onStatusChange?.(video.uploadId, nextStatus);
      } catch (cause) {
        console.error("[admin] status update failed", cause);
        setError(
          cause instanceof Error ? cause.message : "Failed to update status."
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [onStatusChange, status, video.uploadId]
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-lg shadow-black/40 transition hover:-translate-y-1 hover:shadow-black/50">
      <div className="relative aspect-[9/16] w-full bg-slate-950">
        {video.playbackId ? (
          <video
            key={video.playbackId}
            src={`https://stream.mux.com/${video.playbackId}.m3u8`}
            poster={`https://image.mux.com/${video.playbackId}/thumbnail.png?time=1`}
            className={`h-full w-full object-cover transition duration-500 ${
              isHovering ? "opacity-100" : "opacity-90"
            }`}
            playsInline
            muted={isMuted}
            loop
            preload="metadata"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-500">
            <span className="size-12 rounded-full border border-slate-700" />
            <p className="px-6 text-center">
              Video processing… Refresh shortly to stream.
            </p>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-wide text-slate-100">
          {STATUS_LABELS[status] ?? status}
        </div>
        {video.playbackId ? (
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-black/80"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        ) : null}
      </div>

      <footer className="flex flex-1 flex-col gap-3 p-4 text-xs text-slate-300">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
          <span>{video.muxStatus ?? "pending"}</span>
          <time dateTime={video.createdAt}>
            {new Date(video.createdAt).toLocaleString()}
          </time>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          <span>
            Upload ID:{" "}
            <span className="font-mono text-slate-200">
              {video.uploadId.slice(0, 8)}…
            </span>
          </span>
          {video.candidateId && (
            <span>
              Candidate:{" "}
              <span className="font-mono text-slate-200">
                {video.candidateId.slice(0, 8)}…
              </span>
            </span>
          )}
        </div>
        {video.duration ? (
          <p className="text-[11px] text-slate-400">
            {video.duration.toFixed(1)} sec video
          </p>
        ) : null}
        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-[11px] text-red-300">
            {error}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-2">
          {ACTIONS.map((action) => {
            const toneClass =
              action.tone === "positive"
                ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : action.tone === "warning"
                ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                : action.tone === "danger"
                ? "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                : "bg-slate-700/40 text-slate-200 hover:bg-slate-600/40";

            return (
              <button
                key={action.value}
                type="button"
                onClick={() => handleStatusUpdate(action.value)}
                disabled={isUpdating || status === action.value}
                className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </footer>
    </article>
  );
}

