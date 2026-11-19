export interface PointCostCommunityAmount {
  postAmount: number;
  commentAmount: number;
  reactionAmount: number;
}

export interface PointCostPlatformAmount {
  checkInAmount: number;
  taskAmount: number;
  referralAmount: number;
}

export interface PointCostRawDay {
  date: string;
  serviceAmount: number;
  contentAmount: number;
  communityAmount: PointCostCommunityAmount;
  platformAmount: PointCostPlatformAmount;
}

export type PointCostCategoryKey =
  | "serviceAmount"
  | "contentAmount"
  | "communityAmount"
  | "platformAmount";

export type PointCostDetailKey =
  | "postAmount"
  | "commentAmount"
  | "reactionAmount"
  | "checkInAmount"
  | "taskAmount"
  | "referralAmount";

export type PointCostDetailParent = "communityAmount" | "platformAmount";

export type PointCostDay = {
  date: string;
  totalAmount: number;
} & Record<PointCostCategoryKey, number>;

export type PointCostAmountKey = PointCostCategoryKey | "totalAmount";

export interface PointCostCategory {
  key: PointCostCategoryKey;
  name: string;
  color: string;
}

export interface PointCostDetailDefinition {
  key: PointCostDetailKey;
  parent: PointCostDetailParent;
  name: string;
  color: string;
}

export interface PointCostDetail {
  key: PointCostCategoryKey | PointCostDetailKey;
  parent: PointCostCategoryKey;
  name: string;
  amount: number;
  percent: string;
  color: string;
}

export interface PointCostDateRange {
  startDate: string;
  endDate: string;
}

export interface PointCostSummary {
  rows: PointCostDay[];
  total: PointCostDay | null;
  average: PointCostDay | null;
  averageDayCount: number;
  details: PointCostDetail[];
}
