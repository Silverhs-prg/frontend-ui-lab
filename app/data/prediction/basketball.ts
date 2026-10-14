import type { PredictionGame, PredictionMarket } from "../../types/prediction";


const logoUrls = import.meta.glob<string>("../../assets/prediction/logos/bk/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

// Six games in one league, with the Lab's 1X2 / handicap / total layout.
const fixtures = [
  { id: "bk-demo-01", teamH: "費內巴切", teamA: "考那斯薩拉基利斯籃球會", win: ["0.61", "1.83"], handicap: "6.5", ha: ["0.89", "0.91"], total: "163.5", ou: ["0.90", "0.92"] },
  { id: "bk-demo-02", teamH: "艾思維爾", teamA: "貝爾格勒紅星", win: ["1.08", "0.78"], handicap: "-2.5", ha: ["0.92", "0.88"], total: "166.5", ou: ["0.86", "0.94"] },
  { id: "bk-demo-03", teamH: "維多利亞加斯提伊茲巴斯幹尼亞", teamA: "杜拜籃球會", win: ["1.69", "0.51"], handicap: "-5.5", ha: ["0.94", "0.86"], total: "174.5", ou: ["0.91", "0.89"] },
  { id: "bk-demo-04", teamH: "柏迪遜貝爾格萊德", teamA: "帕納辛奈克斯籃球會", win: ["1.91", "0.45"], handicap: "-6.5", ha: ["0.90", "0.92"], total: "167.5", ou: ["0.95", "0.85"] },
  { id: "bk-demo-05", teamH: "巴塞隆拿籃球俱樂部", teamA: "特拉維夫馬卡比", win: ["0.64", "1.72"], handicap: "5.5", ha: ["0.93", "0.87"], total: "177.5", ou: ["0.89", "0.91"] },
  { id: "bk-demo-06", teamH: "米蘭奧林匹亞", teamA: "皇家馬德里", win: ["1.47", "0.57"], handicap: "-4.5", ha: ["0.86", "0.94"], total: "174.5", ou: ["0.92", "0.88"] },
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

export const getBasketballGames = (): PredictionGame[] =>
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
        mode: "HA",
        options: [
          { oddType: "H", label: "主", spread: signed(-Number(fixture.handicap)), rawSpread: fixture.handicap, odd: fixture.ha[0] },
          { oddType: "A", label: "客", spread: signed(Number(fixture.handicap)), rawSpread: fixture.handicap, odd: fixture.ha[1] },
        ],
      },
      {
        mode: "OU",
        options: [
          { oddType: "O", label: "大", spread: fixture.total, rawSpread: fixture.total, odd: fixture.ou[0] },
          { oddType: "U", label: "小", spread: fixture.total, rawSpread: fixture.total, odd: fixture.ou[1] },
        ],
      },
    ];

    return {
      id: fixture.id,
      gameType: "BK",
      league: "歐洲籃球聯賽",
      ...kickoff(index + 1),
      teamH: fixture.teamH,
      teamA: fixture.teamA,
      logoH: logoUrls[`../../assets/prediction/logos/bk/bk-${String(index + 1).padStart(2, "0")}-home.png`] ?? "",
      logoA: logoUrls[`../../assets/prediction/logos/bk/bk-${String(index + 1).padStart(2, "0")}-away.png`] ?? "",
      status: "pregame",
      matchH: 0,
      matchA: 0,
      markets,
    };
  });
