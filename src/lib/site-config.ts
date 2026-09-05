import fs from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  navLabels: {
    videos: string;
    courts: string;
    feedback: string;
  };
  brandColor: string;
};

export const NAV_ITEMS = [
  { key: "videos", href: "/videos" },
  { key: "courts", href: "/courts" },
  { key: "feedback", href: "/feedback" },
] as const;

export const reservationUrl = "https://reserve.busan.go.kr/index";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  name: "HAAN TENNIS LAB",
  tagline: "Analyze. Train. Play.",
  description:
    "테니스 코칭 영상 아카이브, 부산 코트 예약 정보,\n그리고 AI 피드백까지 — 한 명의 테니스 코치가 정리한 개인 코칭 노트입니다.",
  navLabels: {
    videos: "코칭 영상",
    courts: "코트 & 예약",
    feedback: "AI 피드백",
  },
  brandColor: "#20463A",
};

const REDIS_KEY = "haan-tennis-lab:site-content";
const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

// Upstash Redis가 설정되어 있으면 그걸 쓰고(로컬/배포 모두 동일하게 실시간 반영),
// 설정 안 돼 있으면 로컬 파일로 폴백한다 (Vercel 배포본에서는 파일쓰기가 휘발되므로
// 배포 후에도 실시간 저장이 필요하면 반드시 Upstash를 연결해야 한다).
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function mergeWithDefaults(saved: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...saved,
    navLabels: { ...DEFAULT_SITE_CONTENT.navLabels, ...saved.navLabels },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const redis = getRedis();
  if (redis) {
    const saved = await redis.get<Partial<SiteContent>>(REDIS_KEY);
    return saved ? mergeWithDefaults(saved) : DEFAULT_SITE_CONTENT;
  }

  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, content);
    return;
  }

  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export function isUsingDatabase(): boolean {
  return getRedis() !== null;
}
