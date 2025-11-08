"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RecordingStatus =
  | "idle"
  | "recording"
  | "processing"
  | "ready"
  | "uploaded"
  | "error";

type UploadDetails = {
  assetId: string;
  uploadURL: string;
};

type VideoRecorderProps = {
  candidateId?: string;
  onUploaded?: (details: { streamUID: string }) => void;
  onReset?: () => void;
};

const MIN_DURATION_MS = 30_000;
const MAX_DURATION_MS = 45_000;

export function VideoRecorder({
  candidateId,
  onUploaded,
  onReset,
}: VideoRecorderProps) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [uploading, setUploading] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const supportsMp4 = useMemo(() => {
    if (typeof window === "undefined") return false;
    return MediaRecorder.isTypeSupported("video/mp4;codecs=avc1");
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      cleanupStream();
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanupStream = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null);
  }, [mediaStream]);

  const handleTick = useCallback(() => {
    if (!startTimestampRef.current) return;
    const now = Date.now();
    const elapsed = now - startTimestampRef.current;
    setElapsedMs(elapsed);
    if (elapsed >= MAX_DURATION_MS) {
      stopRecording();
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(handleTick, 200);
  }, [handleTick]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setRecordedBlob(null);
      setRecordedUrl(null);
      setElapsedMs(0);
      onReset?.();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: "user",
        },
      });

      const mimeType = supportsMp4
        ? "video/mp4;codecs=avc1"
        : "video/webm;codecs=vp8,opus";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopTimer();
        cleanupStream();
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setStatus("ready");
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder error", event);
        setError("Recording failed. Please try again.");
        setStatus("error");
        stopTimer();
        cleanupStream();
      };

      recorder.start();
      recorderRef.current = recorder;
      setMediaStream(stream);
      setStatus("recording");
      startTimestampRef.current = Date.now();
      startTimer();
    } catch (cause) {
      console.error(cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to start recording. Please check your camera and microphone permissions."
      );
      setStatus("error");
    }
  }, [cleanupStream, startTimer, stopTimer, supportsMp4]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setStatus("processing");
    }
  }, []);

  const cancelRecording = useCallback(() => {
    stopTimer();
    cleanupStream();
    setElapsedMs(0);
    setRecordedBlob(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
    setStatus("idle");
    onReset?.();
  }, [cleanupStream, onReset, recordedUrl, stopTimer]);

  const uploadRecording = useCallback(async () => {
    if (!recordedBlob) return;
    setStatus("processing");
    setUploading(true);
    setError(null);

    try {
      const uploadDetails = await requestUploadUrl();
      await uploadBlob(uploadDetails, recordedBlob);
      await registerStream(uploadDetails.assetId, candidateId);
      setStatus("uploaded");
      setRecordedBlob(null);
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(null);
      }
      onUploaded?.({ streamUID: uploadDetails.assetId });
    } catch (cause) {
      console.error(cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Upload failed. Please try again."
      );
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }, [candidateId, onUploaded, recordedBlob, recordedUrl]);

  const isMinDurationReached = elapsedMs >= MIN_DURATION_MS;
  const seconds = Math.floor(elapsedMs / 1000);
  const remaining = Math.max(0, Math.ceil((MAX_DURATION_MS - elapsedMs) / 1000));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3rem] text-slate-500">
        <span>
          {status === "recording"
            ? "Recording"
            : status === "uploaded"
            ? "Uploaded"
            : "Ready"}
        </span>
        {status === "recording" && (
          <span className="flex items-center gap-1 text-red-500">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {seconds}s
          </span>
        )}
        {status !== "recording" && recordedBlob && (
          <span className="text-slate-400">{Math.floor(recordedBlob.size / 1024)} KB</span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white">
        {mediaStream ? (
          <video
            className="aspect-[9/16] w-full bg-slate-900 object-cover"
            autoPlay
            playsInline
            muted
            ref={(node) => {
              if (node && mediaStream) {
                node.srcObject = mediaStream;
              }
            }}
          />
        ) : recordedUrl ? (
          <video
            key={recordedUrl}
            src={recordedUrl}
            className="aspect-[9/16] w-full object-cover"
            controls
            playsInline
          />
        ) : (
          <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-2 bg-slate-900">
            <span className="size-12 rounded-full border border-white/30" />
            <p className="text-sm text-white/70">
              Ready to record 30–45 second intro
            </p>
          </div>
        )}

        {status === "recording" && (
          <div className="absolute bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 flex-col gap-2 rounded-full bg-black/60 px-4 py-3 text-center text-xs">
            <span className="font-semibold tracking-wide text-white">
              Keep it friendly and upbeat
            </span>
            <span className="text-white/80">
              Auto stops in {remaining}s
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {status === "idle" && (
          <button
            type="button"
            onClick={startRecording}
            className="flex-1 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Record intro video
          </button>
        )}

        {status === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex-1 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:text-red-700"
          >
            Stop recording
          </button>
        )}

        {(status === "ready" || status === "error") && (
          <>
            <button
              type="button"
              onClick={startRecording}
              className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Re-record
            </button>
            <button
              type="button"
              onClick={cancelRecording}
              className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={uploadRecording}
              disabled={!isMinDurationReached || uploading}
              className="flex-1 rounded-full bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading ? "Uploading…" : "Upload to ReelWork"}
            </button>
          </>
        )}
      </div>

      <FileUploadFallback
        onUploadStart={uploadRecording}
        setRecordedBlob={setRecordedBlob}
        setRecordedUrl={setRecordedUrl}
      />
    </div>
  );
}

async function requestUploadUrl(): Promise<UploadDetails> {
  const response = await fetch("/api/videos/create-upload-url", {
    method: "POST",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to create upload URL.");
  }

  return response.json();
}

async function uploadBlob(details: UploadDetails, blob: Blob) {
  const response = await fetch(details.uploadURL, {
    method: "PUT",
    headers: {
      "Content-Type": blob.type,
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error("Failed to upload video to Cloudflare Stream.");
  }
}

async function registerStream(assetId: string, candidateId?: string) {
  const response = await fetch("/api/videos/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assetId, candidateId }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Failed to register video upload.");
  }
}

type FileUploadFallbackProps = {
  setRecordedBlob: (blob: Blob | null) => void;
  setRecordedUrl: (url: string | null) => void;
  onUploadStart: () => Promise<void>;
};

function FileUploadFallback({
  setRecordedBlob,
  setRecordedUrl,
  onUploadStart,
}: FileUploadFallbackProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;
      }

      if (file.size > 200 * 1024 * 1024) {
        setError("Video file must be under 200MB.");
        return;
      }

      setError(null);
      setSelectedFileName(file.name);
      setRecordedBlob(file);
      const url = URL.createObjectURL(file);
      setRecordedUrl(url);
    },
    [setRecordedBlob, setRecordedUrl]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFileName) return;
    try {
      await onUploadStart();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSelectedFileName(null);
    } catch (cause) {
      console.error(cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Upload failed. Please try again."
      );
    }
  }, [onUploadStart, selectedFileName]);

  return (
    <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
      <p className="font-semibold text-slate-700">Prefer to upload?</p>
      <p className="text-xs text-slate-500">
        Drag in a portrait MP4/WebM clip (max 45 seconds) if you already have one recorded.
      </p>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-sky-300 hover:bg-sky-50">
        <span className="text-sm font-medium text-sky-600">Choose video file</span>
        <span className="mt-1 text-xs text-slate-500">MP4 or WebM up to 200MB</span>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="sr-only"
          onChange={handleFileSelection}
        />
      </label>

      {selectedFileName && (
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <span className="text-xs font-medium text-slate-700">{selectedFileName}</span>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFileName}
            className="self-start rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Upload selected video
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}


