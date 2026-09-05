"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Section = { number: string | null; title: string; body: string };

// AI 응답의 "## 2. 잘하고 있는 점" 같은 헤딩을 기준으로 섹션을 나누고,
// 헤딩 사이의 "---" 구분선은 카드 자체가 구분 역할을 하므로 제거한다.
function parseSections(markdown: string): { intro: string; sections: Section[] } {
  const lines = markdown.split("\n");
  const sections: { title: string; body: string[] }[] = [];
  const intro: string[] = [];
  let current: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    const heading = line.match(/^#{1,3}\s+(.*)$/);
    if (heading) {
      if (current) sections.push(current);
      current = { title: heading[1].trim(), body: [] };
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) continue;
    (current ? current.body : intro).push(line);
  }
  if (current) sections.push(current);

  return {
    intro: intro.join("\n").trim(),
    sections: sections.map(({ title, body }) => {
      const numbered = title.match(/^(\d+)\.\s*(.*)$/);
      return {
        number: numbered ? numbered[1] : null,
        title: numbered ? numbered[2] : title,
        body: body.join("\n").trim(),
      };
    }),
  };
}

const markdownComponents = {
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-3 last:mb-0" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
};

export function FeedbackModal({
  feedback,
  onClose,
}: {
  feedback: string;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState<"image" | "pdf" | null>(null);
  const { intro, sections } = parseSections(feedback);

  async function captureCanvas() {
    if (!contentRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(contentRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
  }

  async function saveAsImage() {
    setIsSaving("image");
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `tennis-feedback-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsSaving(null);
    }
  }

  async function saveAsPdf() {
    setIsSaving("pdf");
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height,
      );
      pdf.save(`tennis-feedback-${Date.now()}.pdf`);
    } finally {
      setIsSaving(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-display text-lg text-ink">코치 피드백</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-ink/40 hover:bg-ink/5 hover:text-ink"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6">
          <div ref={contentRef} className="space-y-4 bg-white p-2">
            {intro && (
              <p className="text-sm leading-relaxed text-ink/70">{intro}</p>
            )}

            {sections.map((section, i) => (
              <section key={i} className="rounded-2xl bg-court/[0.04] p-5">
                <header className="flex items-baseline gap-3">
                  {section.number && (
                    <span className="font-display text-lg text-court/50">
                      {section.number}
                    </span>
                  )}
                  <h3 className="font-display text-base text-ink">
                    {section.title}
                  </h3>
                </header>
                <div className="mt-3 text-sm leading-relaxed text-ink/80">
                  <ReactMarkdown components={markdownComponents}>
                    {section.body}
                  </ReactMarkdown>
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-6 pb-6 pt-2">
          <button
            onClick={saveAsImage}
            disabled={isSaving !== null}
            className="rounded-full bg-court/10 px-5 py-2.5 text-sm font-bold text-court transition hover:bg-court hover:text-paper disabled:opacity-50"
          >
            {isSaving === "image" ? "저장 중…" : "이미지로 저장"}
          </button>
          <button
            onClick={saveAsPdf}
            disabled={isSaving !== null}
            className="rounded-full bg-court/10 px-5 py-2.5 text-sm font-bold text-court transition hover:bg-court hover:text-paper disabled:opacity-50"
          >
            {isSaving === "pdf" ? "저장 중…" : "PDF로 저장"}
          </button>
          <button
            onClick={onClose}
            className="ml-auto rounded-full px-5 py-2.5 text-sm font-bold text-ink/50 hover:bg-ink/5 hover:text-ink"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
