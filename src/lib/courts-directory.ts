export type CourtDirectoryEntry = {
  name: string;
  org: string;
  tags: string[];
  url: string;
};

// 순서는 실제 자주 쓰는 예약처 우선순위를 그대로 따릅니다. 바꾸지 마세요.
export const courtDirectory: CourtDirectoryEntry[] = [
  {
    name: "부산광역시 통합예약",
    org: "해운대수목원 · 강서체육공원 · 구덕운동장 · 화명생태공원 등",
    tags: [],
    // 통합예약 사이트 내 '테니스' 검색 결과 화면으로 바로 연결 (테니스 시설만 필터링됨)
    url: "https://reserve.busan.go.kr/applcnt/searchProgrm?siteNo=&searchGubun=ALL&searchText=테니스",
  },
  {
    name: "부산광역시생활체육문화센터 테니스장",
    org: "부산광역시생활체육문화센터 · 부산 해운대구 · 벡스코역 5번 출구 앞",
    tags: ["인조잔디", "실외"],
    url: "https://www.saba.or.kr/bbs/content.php?co_id=05_09",
  },
  {
    name: "스포원파크 테니스장",
    org: "부산시설공단 (SPO1) · 부산 금정구",
    tags: ["하드코트", "실내/실외"],
    // 시설 선택이 세션 기반(AJAX)이라 URL에 종목을 담을 수 없음 - 대관신청 화면에서 '테니스' 선택
    url: "https://nrsv.spo1.or.kr/fmcs/42",
  },
  {
    name: "부산종합테니스장",
    org: "부산 동래구 · 사직",
    tags: ["인조잔디", "실내"],
    url: "https://www.sajiktennis.kr/sub/court_booking.php?pn=0501",
  },
  {
    name: "을숙도 다목적 생활체육관 테니스장",
    org: "부산 사하구 · 을숙도",
    tags: ["인조잔디", "실내"],
    url: "https://saha-eulsukdogym.kr/html/",
  },
  {
    name: "남구시설관리공단",
    org: "부산 남구 · 백운포 테니스장",
    tags: ["인조잔디", "실외"],
    // 스포원과 같은 예약 플랫폼 - 대관신청 화면에서 '백운포체육공원 > 테니스장' 선택
    url: "https://www.bnfmc.or.kr/reservation/www/9",
  },
];
