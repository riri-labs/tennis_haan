"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { FeedbackModal } from "@/components/feedback-modal";

const LEVELS = ["입문", "초급", "중급", "상급"] as const;
const MAX_VIDEO_MB = 100;

type Status = "idle" | "uploading" | "analyzing" | "error";

const ANALYZING_MESSAGES = [
  "영상 속 자세를 하나씩 뜯어보고 있어요",
  "임팩트 순간의 타점을 확인하는 중이에요",
  "스텝과 무게중심 이동을 분석하고 있어요",
  "스윙 궤적과 팔로우스루를 살펴보는 중이에요",
  "코치의 시선으로 영상을 다시 돌려보고 있어요",
  "거의 다 됐어요, 조금만 더 기다려주세요",
];

export function FeedbackForm({ title }: { title: string }) {
  const [video, setVideo] = useState<{ file: File; previewUrl: string } | null>(
    null,
  );
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("중급");
  const [status, setStatus] = useState<Status>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingSeconds, setAnalyzingSeconds] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusy = status === "uploading" || status === "analyzing";

  useEffect(() => {
    if (status !== "analyzing") {
      setAnalyzingSeconds(0);
      setMessageIndex(0);
      return;
    }
    const timer = setInterval(() => setAnalyzingSeconds((s) => s + 1), 1000);
    const rotator = setInterval(
      () => setMessageIndex((i) => (i + 1) % ANALYZING_MESSAGES.length),
      4000,
    );
    return () => {
      clearInterval(timer);
      clearInterval(rotator);
    };
  }, [status]);

  useEffect(() => {
    if (!isBusy) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBusy]);

  function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setStatus("error");
      setErrorMessage("영상 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setStatus("error");
      setErrorMessage(`영상 용량이 너무 커요 (최대 ${MAX_VIDEO_MB}MB).`);
      return;
    }
    if (video) URL.revokeObjectURL(video.previewUrl);
    setVideo({ file, previewUrl: URL.createObjectURL(file) });
    setStatus("idle");
    setErrorMessage("");
  }

  function removeVideo() {
    if (video) URL.revokeObjectURL(video.previewUrl);
    setVideo(null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!video) {
      setStatus("error");
      setErrorMessage("분석할 영상을 올려주세요.");
      return;
    }

    setStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");
    setFeedback(null);

    try {
      const blob = await upload(video.file.name, video.file, {
        access: "private",
        handleUploadUrl: "/api/blob-upload",
        onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
      });

      setStatus("analyzing");

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: blob.url, description, level }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "피드백을 받아오지 못했습니다.");
      }

      setFeedback(json.feedback);
      setIsModalOpen(true);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-content px-6 py-10 sm:px-10 sm:py-14">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-court/10 text-sm font-bold text-court">
        03
      </span>
      <h1 className="mt-4 font-display text-3xl text-ink">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        훈련 또는 경기 영상을 올려주세요.
        <br />
        준비 자세부터 팔로우스루까지 스윙 전체가 잘 보이는 영상일수록 더
        정확한 분석을 받을 수 있습니다. (최대 {MAX_VIDEO_MB}MB)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <label className="block font-display text-sm text-ink">
            훈련/경기 영상
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!video && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`mt-3 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm transition ${
                  isDragging
                    ? "border-court bg-court/5 text-court"
                    : "border-ink/10 bg-white text-ink/40 hover:border-court hover:text-court"
                }`}
              >
                <span>+ 영상 올리기</span>
                <span className="text-xs text-ink/30">
                  클릭하거나 영상 파일을 이 안으로 끌어다 놓으세요
                </span>
              </button>
            )}
            {video && (
              <div className="relative mt-3">
                <video
                  src={video.previewUrl}
                  controls
                  className="aspect-video w-full rounded-2xl bg-black"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1.5 text-xs text-paper"
                >
                  다시 올리기
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="block font-display text-sm text-ink"
          >
            상황 설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예) 포핸드 스트로크인데 임팩트 이후 공이 자꾸 짧게 떨어져요. 그립은 세미웨스턴이고, 측면에서 찍은 영상입니다."
            className="mt-3 h-32 w-full flex-1 rounded-2xl border-2 border-ink/10 bg-white p-4 text-sm leading-relaxed text-ink placeholder:text-ink/30 focus:border-court focus:outline-none"
          />

          <label className="mt-5 block font-display text-sm text-ink">
            현재 실력
          </label>
          <div className="mt-3 flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  level === l
                    ? "bg-court text-paper"
                    : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "uploading" || status === "analyzing"}
              className="rounded-full bg-court px-8 py-4 text-sm font-bold text-paper transition hover:brightness-90 disabled:opacity-50"
            >
              {isBusy ? "처리 중…" : "피드백 받기"}
            </button>

            {feedback && !isModalOpen && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-court"
              >
                지난 결과 다시 보기
              </button>
            )}
          </div>

          {status === "error" && (
            <p className="mt-3 text-sm text-clay">{errorMessage}</p>
          )}
        </div>
      </form>

      {feedback && isModalOpen && (
        <FeedbackModal
          feedback={feedback}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isBusy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-court/15 border-t-court" />

            <h2 className="mt-5 font-display text-lg text-ink">
              {status === "uploading" ? "영상 업로드 중" : "AI가 영상을 분석하고 있어요"}
            </h2>

            {status === "uploading" ? (
              <>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-court transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-ink/50">{uploadProgress}%</p>
              </>
            ) : (
              <>
                <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-ink/60">
                  {ANALYZING_MESSAGES[messageIndex]}
                </p>
                <p className="mt-1 text-xs text-ink/40">
                  {String(Math.floor(analyzingSeconds / 60)).padStart(2, "0")}:
                  {String(analyzingSeconds % 60).padStart(2, "0")} 경과 · 보통 1~2분
                  걸려요
                </p>
              </>
            )}

            <p className="mt-5 text-xs font-bold text-clay">
              이 창을 닫거나 뒤로가기를 누르면 분석이 취소돼요. 잠시만
              기다려주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
