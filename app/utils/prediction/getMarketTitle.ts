import type { MarketMode } from "../../types/prediction";

const titles: Record<MarketMode, string> = {
  "1X2": "獨贏",
  HA: "讓分",
  OU: "大小",
  GameHA: "讓分(局)",
  GameOU: "大小(局)",
};

export const getMarketTitle = (mode: MarketMode): string => titles[mode];
