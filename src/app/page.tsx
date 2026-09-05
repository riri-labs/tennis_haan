import Link from "next/link";
import { getSiteContent } from "@/lib/site-config";

const sectionCopy = [
  {
    index: "01",
    href: "/videos",
    key: "videos" as const,
    body: "포핸드부터 서브, 풋워크까지 — 믿을 수 있는 코칭 채널만 골라 정리했습니다.",
  },
  {
    index: "02",
    href: "/courts",
    key: "courts" as const,
    body: "부산시 통합예약 사이트로 바로 이동하고, 테니스장 대관 공고를 실시간으로 확인하세요.",
  },
  {
    index: "03",
    href: "/feedback",
    key: "feedback" as const,
    body: "훈련 영상을 올리면, 자세와 다음 훈련 방향에 대한 피드백을 받아볼 수 있습니다.",
  },
];

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <div>
      <section className="mx-auto max-w-content px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24">
        <span className="inline-block rounded-full bg-court/10 px-4 py-1.5 text-sm font-bold text-court">
          {content.name}
        </span>
        <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[1.1] tracking-tight text-ink sm:text-6xl">
          {content.tagline}
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
          {content.description.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </section>

      <section className="mx-auto max-w-content px-6 pb-24 sm:px-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {sectionCopy.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col justify-between gap-12 rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(24,27,24,0.06)] transition hover:shadow-[0_8px_30px_rgba(24,27,24,0.1)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-court/10 font-display text-sm text-court">
                {s.index}
              </span>
              <div>
                <h2 className="font-display text-xl text-ink">
                  {content.navLabels[s.key]}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  {s.body}
                </p>
                <span className="mt-6 inline-block text-sm font-bold text-court">
                  바로가기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
