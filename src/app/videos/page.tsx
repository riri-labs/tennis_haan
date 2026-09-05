import type { Metadata } from "next";
import { videoResources } from "@/lib/videos-data";
import { getSiteContent } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return { title: `${content.navLabels.videos} — ${content.name}` };
}

const categories = Array.from(
  new Set(videoResources.map((v) => v.category)),
);

export default async function VideosPage() {
  const content = await getSiteContent();

  return (
    <div className="mx-auto max-w-content px-6 py-16 sm:px-10">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-court/10 text-sm font-bold text-court">
        01
      </span>
      <h1 className="mt-4 font-display text-3xl text-ink">
        {content.navLabels.videos}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
        특정 영상 링크는 쉽게 사라지거나 비공개로 바뀌기 때문에,
        <br />
        꾸준히 업로드되는 신뢰할 수 있는 코칭 채널을 카테고리별로 골라
        정리했습니다.
      </p>

      <div className="mt-14 space-y-14">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="font-display text-lg text-ink">{category}</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {videoResources
                .filter((v) => v.category === category)
                .map((video) => (
                  <li key={video.channel}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-2xl bg-white p-6 shadow-[0_2px_20px_rgba(24,27,24,0.06)] transition hover:shadow-[0_8px_30px_rgba(24,27,24,0.1)]"
                    >
                      <h3 className="font-display text-base text-ink group-hover:text-court">
                        {video.channel}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/60">
                        {video.note}
                      </p>
                      <span className="mt-4 inline-block text-xs font-bold text-court">
                        채널 보러가기 →
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
