import type { PredictionGame, PredictionMarket } from "../../types/prediction";


const logoUrls = import.meta.glob<string>("../../assets/prediction/logos/sc/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

// Two leagues with three matches each, as in the Lab; every card has 1X2, HA and OU.
const fixtures = [
  { id: "sc-demo-01", league: "歐洲冠軍聯賽", teamH: "薩巴赫.馬薩齊爾", teamA: "布拉格斯拉維亞", win: ["2.42", "3.12", "1.18"], handicap: "-0.5", haHome: "+0.5", haAway: "-0.5", ha: ["0.91", "0.99"], total: "3+50", totalLabel: "2.5/3", ou: ["0.86", "1.04"] },
  { id: "sc-demo-02", league: "歐洲冠軍聯賽", teamH: "朗斯", teamA: "里斯本體育", win: ["1.48", "2.81", "1.72"], handicap: "0", haHome: "0", haAway: "0", ha: ["0.92", "0.98"], total: "3", totalLabel: "3", ou: ["0.93", "0.97"] },
  { id: "sc-demo-03", league: "歐洲冠軍聯賽", teamH: "馬德里體育會", teamA: "曼徹斯特聯", win: ["1.12", "3.18", "2.36"], handicap: "0.5", haHome: "-0.5", haAway: "+0.5", ha: ["0.95", "0.94"], total: "3-50", totalLabel: "3/3.5", ou: ["1.03", "0.87"] },
  { id: "sc-demo-04", league: "英格蘭冠軍聯賽", teamH: "伯恩利", teamA: "查爾頓競技", win: ["0.72", "3.08", "3.52"], handicap: "1+50", haHome: "-0.5/-1", haAway: "+0.5/+1", ha: ["0.89", "1.01"], total: "2.5", totalLabel: "2.5", ou: ["0.88", "1.02"] },
  { id: "sc-demo-05", league: "英格蘭冠軍聯賽", teamH: "狼隊", teamA: "博爾頓流浪者", win: ["0.55", "3.74", "5.16"], handicap: "1-50", haHome: "-1/-1.5", haAway: "+1/+1.5", ha: ["0.96", "0.94"], total: "3", totalLabel: "3", ou: ["0.97", "0.93"] },
  { id: "sc-demo-06", league: "英格蘭冠軍聯賽", teamH: "卡地夫城", teamA: "沃特福德", win: ["0.82", "3.22", "2.67"], handicap: "1+50", haHome: "-0.5/-1", haAway: "+0.5/+1", ha: ["0.98", "0.92"], total: "3-50", totalLabel: "3/3.5", ou: ["1.02", "0.89"] },
] as const;

const kickoff = (hoursAhead: number) => {
  const date = new Date(Date.now() + hoursAhead * 3_600_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    gDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    gTime: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

export const getSoccerGames = (): PredictionGame[] =>
  fixtures.map((fixture, index): PredictionGame => {
    const markets: PredictionMarket[] = [
      {
        mode: "1X2",
        options: [
          { oddType: "H", label: "主勝", rawSpread: "1X2", odd: fixture.win[0] },
          { oddType: "T", label: "和局", rawSpread: "1X2", odd: fixture.win[1] },
          { oddType: "A", label: "客勝", rawSpread: "1X2", odd: fixture.win[2] },
        ],
      },
      {
        mode: "HA",
        options: [
          { oddType: "H", label: "主", spread: fixture.haHome, rawSpread: fixture.handicap, odd: fixture.ha[0] },
          { oddType: "A", label: "客", spread: fixture.haAway, rawSpread: fixture.handicap, odd: fixture.ha[1] },
        ],
      },
      {
        mode: "OU",
        options: [
          { oddType: "O", label: "大", spread: fixture.totalLabel, rawSpread: fixture.total, odd: fixture.ou[0] },
          { oddType: "U", label: "小", spread: fixture.totalLabel, rawSpread: fixture.total, odd: fixture.ou[1] },
        ],
      },
    ];

    return {
      id: fixture.id,
      gameType: "SC",
      league: fixture.league,
      ...kickoff(index + 1),
      teamH: fixture.teamH,
      teamA: fixture.teamA,
      logoH: logoUrls[`../../assets/prediction/logos/sc/sc-${String(index + 1).padStart(2, "0")}-home.png`] ?? "",
      logoA: logoUrls[`../../assets/prediction/logos/sc/sc-${String(index + 1).padStart(2, "0")}-away.png`] ?? "",
      status: "pregame",
      matchH: 0,
      matchA: 0,
      markets,
    };
  });
