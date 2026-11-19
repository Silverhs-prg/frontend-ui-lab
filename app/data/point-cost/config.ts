import type { PointCostCategory, PointCostDetailDefinition } from "../../types/point-cost";

export const pointCostCategories: PointCostCategory[] = [
  { key: "serviceAmount", name: "功能服務支出", color: "#5DBD3D" },
  { key: "contentAmount", name: "內容服務支出", color: "#3298E8" },
  { key: "communityAmount", name: "社群互動支出", color: "#AE76D0" },
  { key: "platformAmount", name: "平台回饋支出", color: "#E8AD16" },
];

export const pointCostDetailDefinitions: PointCostDetailDefinition[] = [
  { key: "postAmount", parent: "communityAmount", name: "內容發布", color: "#9654C0" },
  { key: "commentAmount", parent: "communityAmount", name: "內容回覆", color: "#AE76D0" },
  { key: "reactionAmount", parent: "communityAmount", name: "互動回饋", color: "#C59CE0" },
  { key: "checkInAmount", parent: "platformAmount", name: "每日簽到", color: "#CD9210" },
  { key: "taskAmount", parent: "platformAmount", name: "任務獎勵", color: "#E8AD16" },
  { key: "referralAmount", parent: "platformAmount", name: "推薦回饋", color: "#F4C85A" },
];
