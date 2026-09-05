"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-config";

const PASSWORD_KEY = "haan-admin-password";

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [content, setContent] = useState<SiteContent | null>(null);
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSWORD_KEY);
    if (saved) setPassword(saved);
  }, []);

  useEffect(() => {
    if (!password) return;
    setStatus("loading");
    fetch("/api/admin/content", { headers: { "x-admin-password": password } })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "불러오기에 실패했습니다.");
        setContent(json.content);
        setUsingDatabase(json.usingDatabase);
        setStatus("idle");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error.message);
        if (String(error.message).includes("비밀번호")) {
          sessionStorage.removeItem(PASSWORD_KEY);
          setPassword(null);
        }
      });
  }, [password]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem(PASSWORD_KEY, passwordInput);
    setPassword(passwordInput);
  }

  async function handleSave() {
    if (!content || !password) return;
    setStatus("saving");
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(content),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장에 실패했습니다.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "저장에 실패했습니다.");
    }
  }

  if (!password) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24 sm:px-10">
        <h1 className="font-display text-2xl text-ink">관리자 로그인</h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-2xl border-2 border-ink/10 bg-white p-4 text-sm focus:border-court focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-court px-8 py-4 text-sm font-bold text-paper transition hover:brightness-90"
          >
            로그인
          </button>
          {authError && <p className="text-sm text-clay">{authError}</p>}
        </form>
      </div>
    );
  }

  if (status === "loading" || !content) {
    return (
      <div className="mx-auto max-w-content px-6 py-24 text-center text-ink/40 sm:px-10">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
      <h1 className="font-display text-3xl text-ink">관리자 페이지</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        사이트 이름, 문구, 메뉴 이름, 브랜드 컬러를 여기서 바꿀 수 있어요.
        <br />
        저장하면 바로 사이트에 반영됩니다.
      </p>

      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
          usingDatabase ? "bg-court/10 text-court" : "bg-clay/10 text-clay"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {usingDatabase
          ? "DB 연결됨 — 배포된 사이트에서도 실시간 저장돼요"
          : "파일 모드 — 로컬에서만 저장돼요 (Upstash 연결 시 배포본에도 실시간 반영)"}
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <label className="block font-display text-sm text-ink">
            사이트 이름
          </label>
          <input
            value={content.name}
            onChange={(e) => setContent({ ...content, name: e.target.value })}
            className="mt-3 w-full rounded-2xl border-2 border-ink/10 bg-white p-4 text-sm focus:border-court focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-display text-sm text-ink">
            헤드라인 (태그라인)
          </label>
          <input
            value={content.tagline}
            onChange={(e) =>
              setContent({ ...content, tagline: e.target.value })
            }
            className="mt-3 w-full rounded-2xl border-2 border-ink/10 bg-white p-4 text-sm focus:border-court focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-display text-sm text-ink">
            설명 문구
          </label>
          <p className="mt-1 text-xs text-ink/40">
            줄바꿈하고 싶은 곳에서 Enter를 누르면 그대로 화면에 반영돼요.
          </p>
          <textarea
            value={content.description}
            onChange={(e) =>
              setContent({ ...content, description: e.target.value })
            }
            rows={4}
            className="mt-3 w-full rounded-2xl border-2 border-ink/10 bg-white p-4 text-sm leading-relaxed focus:border-court focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-display text-sm text-ink">
            메뉴 이름
          </label>
          <div className="mt-3 space-y-3">
            {(["videos", "courts", "feedback"] as const).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-ink/40">
                  {key === "videos" && "/videos"}
                  {key === "courts" && "/courts"}
                  {key === "feedback" && "/feedback"}
                </span>
                <input
                  value={content.navLabels[key]}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      navLabels: {
                        ...content.navLabels,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="flex-1 rounded-2xl border-2 border-ink/10 bg-white p-3 text-sm focus:border-court focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-display text-sm text-ink">
            브랜드 컬러
          </label>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={content.brandColor}
              onChange={(e) =>
                setContent({ ...content, brandColor: e.target.value })
              }
              className="h-12 w-12 cursor-pointer rounded-xl border-2 border-ink/10"
            />
            <input
              value={content.brandColor}
              onChange={(e) =>
                setContent({ ...content, brandColor: e.target.value })
              }
              className="w-32 rounded-2xl border-2 border-ink/10 bg-white p-3 text-sm focus:border-court focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="rounded-full bg-court px-8 py-4 text-sm font-bold text-paper transition hover:brightness-90 disabled:opacity-50"
          >
            {status === "saving" ? "저장 중…" : "저장하기"}
          </button>
          {status === "saved" && (
            <span className="text-sm font-bold text-court">저장 완료!</span>
          )}
          {status === "error" && (
            <span className="text-sm text-clay">{errorMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
}
