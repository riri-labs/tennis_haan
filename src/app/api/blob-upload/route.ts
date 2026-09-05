import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// 영상을 우리 서버(Vercel 함수)를 거치지 않고 브라우저에서 바로 Vercel Blob으로
// 업로드하기 위한 토큰 발급 엔드포인트. Vercel 함수의 4.5MB 요청 본문 제한을
// 우회하기 위한 표준 패턴이다.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["video/*"],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // 별도 후처리 없음 — 업로드 완료 후 클라이언트가 받은 URL로 /api/feedback을 호출한다.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "업로드 토큰 발급에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
