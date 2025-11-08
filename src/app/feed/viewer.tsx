"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

type FeedVideo = {
  uploadId: string;
  playbackId: string;
  duration: number | null;
  createdAt: string;
};

type Props = {
  videos: FeedVideo[];
};

export function FeedViewer({ videos }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});

  const sortedVideos = useMemo(() => videos ?? [], [videos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-video-id");
          if (!id) return;
          const videoEl = videoRefs.current.get(id);
          if (!videoEl) return;

          if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
            setActiveIndex((prev) => {
              const nextIndex = sortedVideos.findIndex(
                (video) => video.uploadId === id
              );
              return nextIndex >= 0 ? nextIndex : prev;
            });
            videoEl
              .play()
              .catch(() => {
                /* ignore autoplay issues */
              });
          } else {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        });
      },
      {
        threshold: [0.25, 0.75],
        root: null,
      }
    );

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-video-id]")
    );
    nodes.forEach((node) => observer.observe(node));

    return () => {
      nodes.forEach((node) => observer.unobserve(node));
      observer.disconnect();
    };
  }, [sortedVideos]);

  const storeRef = useCallback<
    (id: string) => (node: HTMLVideoElement | null) => void
  >(
    (id: string) => (node: HTMLVideoElement | null) => {
      if (!node) {
        videoRefs.current.delete(id);
      } else {
        videoRefs.current.set(id, node);
      }
    },
    []
  );

  const handleScroll = useCallback(
    (direction: "next" | "prev") => {
      setActiveIndex((prev) => {
        if (direction === "next") {
          return Math.min(prev + 1, sortedVideos.length - 1);
        }
        return Math.max(prev - 1, 0);
      });
    },
    [sortedVideos.length]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        handleScroll("next");
      }
      if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        handleScroll("prev");
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-video-id="${sortedVideos[activeIndex]?.uploadId}"]`
    );
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, sortedVideos]);

  useEffect(() => {
    if (sortedVideos.length) {
      setMutedMap((prev) => {
        const next = { ...prev };
        sortedVideos.forEach((video) => {
          if (!(video.uploadId in next)) {
            next[video.uploadId] = true;
          }
        });
        return next;
      });
    }
  }, [sortedVideos]);

  useEffect(() => {
    setMutedMap((prev) => {
      const next = { ...prev };
      sortedVideos.forEach((video, index) => {
        if (index !== activeIndex) {
          next[video.uploadId] = true;
        }
      });
      return next;
    });
  }, [activeIndex, sortedVideos]);

  if (!sortedVideos.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-300">
        <p className="text-sm text-slate-400">
          No live videos yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex h-screen w-full max-w-sm snap-y snap-mandatory flex-col overflow-y-scroll bg-black md:max-w-md"
    >
      {sortedVideos.map((video, index) => (
        <section
          key={video.uploadId}
          data-video-id={video.uploadId}
          className="relative flex h-screen snap-center items-center justify-center px-4 py-6"
        >
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-slate-900">
            <video
              ref={storeRef(video.uploadId)}
              src={`https://stream.mux.com/${video.playbackId}.m3u8`}
              poster={`https://image.mux.com/${video.playbackId}/thumbnail.png?time=1`}
              className="h-full w-full object-cover"
              playsInline
              muted={mutedMap[video.uploadId] ?? true}
              loop
              preload="metadata"
              controls={false}
            />

            <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
              Live video
            </div>
            <button
              type="button"
              onClick={() =>
                setMutedMap((prev) => ({
                  ...prev,
                  [video.uploadId]: !(prev[video.uploadId] ?? true),
                }))
              }
              className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-black/80"
            >
              {mutedMap[video.uploadId] ?? true ? "Unmute" : "Mute"}
            </button>
            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">
              {index + 1} / {sortedVideos.length}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

