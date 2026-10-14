import type { PredictionGame, PredictionMarket } from "../../types/prediction";


const logoUrls = import.meta.glob<string>("../../assets/prediction/logos/tn/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

// Keep the Lab's six upcoming matches and its 1X2 / game handicap / game total mix.
const fixtures = [
  { id: "tn-demo-01", league: "ATP 單打", teamH: "德米瑙爾", teamA: "馬里亞諾·納馮內", win: ["0.54", "1.35"], handicap: "4.5", ha: ["0.87", "0.93"], total: "20.5", ou: ["0.94", "0.86"] },
  { id: "tn-demo-02", league: "ATP 單打", teamH: "艾力克斯·摩爾根", teamA: "亞瑟·瑞德克內希", win: ["0.81", "1.01"], handicap: "-2", ha: ["0.93", "0.87"], total: "22.5", ou: ["0.88", "0.92"] },
  { id: "tn-demo-03", league: "WTA 單打", teamH: "S·科寧", teamA: "阿什琳·克魯格", win: ["0.68", "1.19"], handicap: "-3", ha: ["0.86", "0.94"], total: "21.5", ou: ["0.89", "0.91"] },
  { id: "tn-demo-04", league: "WTA 單打", teamH: "凱蒂·沃利涅", teamA: "羅賓·蒙哥馬利", win: ["1.12", "0.74"], handicap: "2", ha: ["0.95", "0.85"], total: "21.5", ou: ["0.87", "0.93"] },
  { id: "tn-demo-05", league: "WTA 單打", teamH: "尤利婭·斯塔羅杜布采娃", teamA: "A·查拉耶娃", win: ["1.21", "0.70"], handicap: "2.5", ha: ["0.88", "0.92"], total: "21.5", ou: ["0.96", "0.84"] },
  { id: "tn-demo-06", league: "ATP 單打", teamH: "霍爾格·魯恩", teamA: "基里安·雅凱", win: ["0.63", "1.32"], handicap: "2.5", ha: ["0.94", "0.86"], total: "22.5", ou: ["0.91", "0.89"] },
] as const;

const kickoff = (hoursAhead: number) => {
  const date = new Date(Date.now() + hoursAhead * 3_600_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    gDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    gTime: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

const signed = (value: number) => value > 0 ? `+${value}` : String(value);

export const getTennisGames = (): PredictionGame[] =>
  fixtures.map((fixture, index): PredictionGame => {
    const markets: PredictionMarket[] = [
      {
        mode: "1X2",
        options: [
          { oddType: "H", label: "主勝", rawSpread: "1X2", odd: fixture.win[0] },
          { oddType: "A", label: "客勝", rawSpread: "1X2", odd: fixture.win[1] },
        ],
      },
      {
        mode: "GameHA",
        options: [
          { oddType: "H", label: "主", spread: signed(-Number(fixture.handicap)), rawSpread: fixture.handicap, odd: fixture.ha[0] },
          { oddType: "A", label: "客", spread: signed(Number(fixture.handicap)), rawSpread: fixture.handicap, odd: fixture.ha[1] },
        ],
      },
      {
        mode: "GameOU",
        options: [
          { oddType: "O", label: "大", spread: fixture.total, rawSpread: fixture.total, odd: fixture.ou[0] },
          { oddType: "U", label: "小", spread: fixture.total, rawSpread: fixture.total, odd: fixture.ou[1] },
        ],
      },
    ];

    return {
      id: fixture.id,
      gameType: "TN",
      league: fixture.league,
      ...kickoff(index + 1),
      teamH: fixture.teamH,
      teamA: fixture.teamA,
      logoH: logoUrls[`../../assets/prediction/logos/tn/tn-${String(index + 1).padStart(2, "0")}-home.png`] ?? "",
      logoA: logoUrls[`../../assets/prediction/logos/tn/tn-${String(index + 1).padStart(2, "0")}-away.png`] ?? "",
      status: "pregame",
      matchH: 0,
      matchA: 0,
      markets,
    };
  });
