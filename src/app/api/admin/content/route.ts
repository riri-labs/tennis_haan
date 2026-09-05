import { NextRequest, NextResponse } from "next/server";
import {
  getSiteContent,
  saveSiteContent,
  isUsingDatabase,
  SiteContent,
} from "@/lib/site-config";

function isAuthorized(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return req.headers.get("x-admin-password") === password;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json({ content, usingDatabase: isUsingDatabase() });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  let body: SiteContent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 본문을 해석할 수 없습니다." }, { status: 400 });
  }

  if (!body.name || !body.tagline || !body.brandColor) {
    return NextResponse.json({ error: "필수 항목이 비어있습니다." }, { status: 400 });
  }

  try {
    await saveSiteContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "저장에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
