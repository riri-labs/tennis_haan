import type { Metadata } from "next";
import { courtDirectory } from "@/lib/courts-directory";
import { getSiteContent } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return { title: `${content.navLabels.courts} — ${content.name}` };
}

export default async function CourtsPage() {
  const content = await getSiteContent();

  return (
    <div className="mx-auto max-w-content px-6 py-16 sm:px-10">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-court/10 text-sm font-bold text-court">
        02
      </span>
      <h1 className="mt-4 font-display text-3xl text-ink">
        {content.navLabels.courts}
      </h1>

      <div className="mt-10">
        <h2 className="font-display text-lg text-ink">
          예약 가능한 테니스장
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
          부산 시내 테니스장 예약 사이트는 운영 기관마다 따로 나뉘어 있어요.
          <br />
          매번 검색하지 않아도 되게, 자주 쓰는 곳들을 모아뒀습니다.
        </p>

        <ul className="mt-8 space-y-4">
          {courtDirectory.map((court) => (
            <li
              key={court.name}
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_20px_rgba(24,27,24,0.06)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-display text-base text-ink">
                  {court.name}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{court.org}</p>
                {court.tags.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {court.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-bold text-ink/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={court.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block shrink-0 whitespace-nowrap rounded-full bg-court/10 px-5 py-2.5 text-sm font-bold text-court transition hover:bg-court hover:text-paper"
              >
                예약하러 가기 →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
