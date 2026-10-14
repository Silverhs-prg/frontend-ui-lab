import type { PredictionGame, SportType } from "../../types/prediction";
import { getTennisGames } from "./tennis";
import { getSoccerGames } from "./soccer";
import { getBasketballGames } from "./basketball";

const gameFactories: Record<SportType, () => PredictionGame[]> = {
  TN: getTennisGames,
  SC: getSoccerGames,
  BK: getBasketballGames,
};

export const getGamesBySport = (sport: SportType): PredictionGame[] =>
  gameFactories[sport]();
