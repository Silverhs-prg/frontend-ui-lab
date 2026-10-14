export type SportType = "TN" | "SC" | "BK";

export type GameStatus = "pregame" | "inProgress" | "final" | "postponed";

export type MarketMode = "1X2" | "HA" | "OU" | "GameHA" | "GameOU";

export const PREDICTION_MARKET_MODES: MarketMode[] = [
  "1X2",
  "HA",
  "OU",
  "GameHA",
  "GameOU",
];

export type OddType = "H" | "A" | "T" | "O" | "U";

export interface PredictionOption {
  oddType: OddType;
  label: string;
  spread?: string;
  rawSpread: string;
  odd: string;
  disabled?: boolean;
}

export interface PredictionMarket {
  mode: MarketMode;
  submitMode?: MarketMode;
  options: PredictionOption[];
}

export interface PredictionGame {
  id: string;
  gameType: SportType;
  league: string;
  gDate: string;
  gTime: string;
  teamH: string;
  teamA: string;
  status: GameStatus;
  matchH: number;
  matchA: number;
  logoH?: string;
  logoA?: string;
  match_Detail?: Record<string, string>;
  playByPlay?: { Time?: string };
  markets: PredictionMarket[];
}

export interface PredictionSelection {
  id: string;
  gameId: string;
  gameType: SportType;
  league: string;
  gDate: string;
  gTime: string;
  teamH: string;
  teamA: string;
  mode: MarketMode;
  submitMode?: MarketMode;
  oddType: OddType;
  label: string;
  spread?: string;
  rawSpread: string;
  odd: string;
}
