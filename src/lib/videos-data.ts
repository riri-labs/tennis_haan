export type VideoResource = {
  category: string;
  channel: string;
  url: string;
  note: string;
};

// 특정 영상 하나를 링크하면 삭제/비공개 시 링크가 깨지기 쉬워서,
// 신뢰할 수 있는 코칭 채널 자체를 카테고리별로 큐레이션했습니다.
export const videoResources: VideoResource[] = [
  {
    category: "스트로크 기본기",
    channel: "Essential Tennis",
    url: "https://www.youtube.com/results?search_query=Essential+Tennis+forehand",
    note: "포핸드/백핸드의 그립과 스윙 궤적을 단계별로 뜯어서 설명하는 채널. 초·중급자가 기본기를 다지기 좋습니다.",
  },
  {
    category: "스트로크 기본기",
    channel: "Intuitive Tennis",
    url: "https://www.youtube.com/results?search_query=Intuitive+Tennis",
    note: "NCAA 디비전1 선수 출신 코치가 운영. 매주 업로드되며 스트로크의 '느낌'을 언어화하는 데 강점이 있습니다.",
  },
  {
    category: "서브",
    channel: "Top Speed Tennis",
    url: "https://www.youtube.com/results?search_query=Top+Speed+Tennis+serve",
    note: "서브 스피드와 안정성을 함께 잡는 드릴 위주. 토스, 트로피 자세, 프로네이션을 구간별로 다룹니다.",
  },
  {
    category: "전술 · 풋워크",
    channel: "Top Tennis Training",
    url: "https://www.youtube.com/results?search_query=Top+Tennis+Training+footwork",
    note: "랠리 상황별 포지셔닝과 풋워크, 그리고 실전 전술을 코트 위 예시로 설명합니다.",
  },
  {
    category: "프로 분석",
    channel: "Online Tennis Instruction",
    url: "https://www.youtube.com/channel/UCTia5ng0rbduizMCQqEepbg",
    note: "페더러·나달 등 투어 선수들의 스윙을 슬로모션으로 쪼개서 아마추어가 참고할 포인트를 짚어줍니다.",
  },
];
