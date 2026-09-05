# HAAN TENNIS LAB

개인 테니스 코칭 웹페이지. Next.js 15 + TypeScript + Tailwind CSS.

## 구성

- `/videos` — 큐레이션한 테니스 코칭 유튜브 채널 (`src/lib/videos-data.ts`에서 편집)
- `/courts` — 부산 시내 테니스장 예약 사이트 모음 (`src/lib/courts-directory.ts`에서 편집)
- `/feedback` — 훈련/경기 영상을 올리면 Gemini API가 테니스 코치 관점의 피드백을 작성
- `/admin` — 사이트 이름, 헤드라인, 설명, 메뉴 이름, 브랜드 컬러를 웹에서 바로 수정

## 처음 실행하기

### 1. Node.js 설치

이 프로젝트는 Node.js 20 이상이 필요합니다. [nodejs.org](https://nodejs.org)에서 LTS 버전을 설치하세요.

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.

```bash
cp .env.local.example .env.local
```

- `GEMINI_API_KEY`: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)에서 무료로 발급받은 API 키 (신용카드 등록 불필요)
- `ADMIN_PASSWORD`: `/admin` 페이지 접근용 비밀번호. 직접 정해서 넣으세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 관리자 페이지 (`/admin`)

사이트 이름, 헤드라인, 설명 문구, 메뉴 이름, 브랜드 컬러를 코드를 건드리지 않고 웹 화면에서 바로 바꿀 수 있어요. `ADMIN_PASSWORD`로 로그인하면 저장 즉시 사이트에 반영됩니다.

**중요한 제약**: 저장된 내용은 프로젝트 안의 `data/site-content.json` 파일에 기록돼요.
- **로컬에서 개발 중일 때**는 파일이 실제로 바뀌고 바로 반영됩니다.
- **Vercel에 배포된 사이트에서는** 서버가 매 요청마다 새로 뜨는 서버리스 구조라 파일 쓰기가 영구 저장되지 않아요. 즉, 배포된 사이트의 `/admin`에서 저장해도 그 서버 인스턴스가 재시작되면 사라질 수 있습니다.
- 그래서 실제 운영 흐름은: **로컬에서 `/admin`으로 내용을 다듬고 → `git add/commit/push` → Vercel이 새로 배포** 하는 방식을 권장해요. `data/site-content.json`은 `.gitignore`에 포함되어 있지 않으니 그대로 커밋하면 됩니다.
- 배포된 사이트에서도 실시간으로 바로 저장되게 하려면 별도의 데이터베이스(예: Vercel Postgres, Upstash Redis 등) 연동이 필요합니다 — 필요하면 이어서 작업 가능해요.

## Vercel 배포

1. 이 폴더를 GitHub 저장소로 push
2. [vercel.com](https://vercel.com)에서 저장소를 Import
3. 프로젝트 설정 → Environment Variables에 `GEMINI_API_KEY`, `ADMIN_PASSWORD` 추가
4. Deploy

`.env.local` 파일은 `.gitignore`에 포함되어 있어 저장소에 올라가지 않습니다. 절대 API 키를 코드에 직접 적지 마세요.

## 콘텐츠 수정 위치

- 사이트 이름/문구/메뉴 이름/브랜드 컬러: `/admin` 페이지 (또는 `data/site-content.json` 직접 수정)
- 코칭 영상 목록: `src/lib/videos-data.ts`
- 코트 예약처 목록: `src/lib/courts-directory.ts`
- 인스타그램 링크: `src/components/site-footer.tsx`
- 폰트: `src/app/layout.tsx`
