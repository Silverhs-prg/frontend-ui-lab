import type { OddType } from "../../types/prediction";

export const getSelectionTarget = (
  oddType: OddType,
  teamH: string,
  teamA: string,
): string => {
  switch (oddType) {
    case "H": return teamH;
    case "A": return teamA;
    case "T": return "和局";
    case "O": return "大";
    case "U": return "小";
  }
};