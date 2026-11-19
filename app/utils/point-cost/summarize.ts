import dayjs from "dayjs";
import { pointCostCategories, pointCostDetailDefinitions } from "../../data/point-cost/config";
import type {
  PointCostCommunityAmount,
  PointCostDateRange,
  PointCostDay,
  PointCostDetail,
  PointCostDetailKey,
  PointCostPlatformAmount,
  PointCostRawDay,
  PointCostSummary,
} from "../../types/point-cost";

const pointCostAmountOrZero = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

function pointCostEmptyRow(date: string): PointCostDay {
  return {
    date,
    serviceAmount: 0,
    contentAmount: 0,
    communityAmount: 0,
    platformAmount: 0,
    totalAmount: 0,
  };
}

function pointCostValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && dayjs(date).format("YYYY-MM-DD") === date;
}

export function summarizePointCosts(
  days: readonly PointCostRawDay[],
  range: PointCostDateRange,
): PointCostSummary {
  const pointCostEmptySummary: PointCostSummary = {
    rows: [], total: null, average: null, averageDayCount: 0, details: [],
  };
  if (!pointCostValidDate(range.startDate) || !pointCostValidDate(range.endDate) || range.startDate > range.endDate) {
    return pointCostEmptySummary;
  }

  const pointCostAverageDayCount = dayjs(range.endDate).diff(dayjs(range.startDate), "day") + 1;
  const pointCostDetailTotals = Object.fromEntries(
    pointCostDetailDefinitions.map((detail) => [detail.key, 0]),
  ) as Record<PointCostDetailKey, number>;

  const pointCostRows = days
    .filter((day) => day.date >= range.startDate && day.date <= range.endDate)
    .map((day): PointCostDay => {
      const community: PointCostCommunityAmount = {
        postAmount: pointCostAmountOrZero(day.communityAmount?.postAmount),
        commentAmount: pointCostAmountOrZero(day.communityAmount?.commentAmount),
        reactionAmount: pointCostAmountOrZero(day.communityAmount?.reactionAmount),
      };
      const platform: PointCostPlatformAmount = {
        checkInAmount: pointCostAmountOrZero(day.platformAmount?.checkInAmount),
        taskAmount: pointCostAmountOrZero(day.platformAmount?.taskAmount),
        referralAmount: pointCostAmountOrZero(day.platformAmount?.referralAmount),
      };
      for (const detail of pointCostDetailDefinitions) {
        pointCostDetailTotals[detail.key] += detail.parent === "communityAmount"
          ? community[detail.key as keyof PointCostCommunityAmount]
          : platform[detail.key as keyof PointCostPlatformAmount];
      }

      const pointCostRow = pointCostEmptyRow(day.date);
      pointCostRow.serviceAmount = pointCostAmountOrZero(day.serviceAmount);
      pointCostRow.contentAmount = pointCostAmountOrZero(day.contentAmount);
      pointCostRow.communityAmount = community.postAmount + community.commentAmount + community.reactionAmount;
      pointCostRow.platformAmount = platform.checkInAmount + platform.taskAmount + platform.referralAmount;
      pointCostRow.totalAmount = pointCostCategories.reduce((sum, category) => sum + pointCostRow[category.key], 0);
      return pointCostRow;
    });

  if (!pointCostRows.length) return pointCostEmptySummary;

  const pointCostTotal = pointCostEmptyRow("總計");
  for (const row of pointCostRows) {
    for (const category of pointCostCategories) pointCostTotal[category.key] += row[category.key];
    pointCostTotal.totalAmount += row.totalAmount;
  }

  const pointCostAverage = pointCostEmptyRow("平均");
  for (const category of pointCostCategories) {
    pointCostAverage[category.key] = pointCostTotal[category.key] / pointCostAverageDayCount;
  }
  pointCostAverage.totalAmount = pointCostTotal.totalAmount / pointCostAverageDayCount;

  const pointCostDetails: PointCostDetail[] = pointCostCategories.flatMap((category) => {
    const children = pointCostDetailDefinitions.filter((detail) => detail.parent === category.key);
    const entries = children.length
      ? children.map((detail) => ({
          key: detail.key,
          parent: category.key,
          name: detail.name,
          amount: pointCostDetailTotals[detail.key],
          color: detail.color,
        }))
      : [{ key: category.key, parent: category.key, name: category.name, amount: pointCostTotal[category.key], color: category.color }];
    return entries.map((entry) => ({
      ...entry,
      percent: pointCostTotal.totalAmount > 0
        ? `${(entry.amount / pointCostTotal.totalAmount * 100).toFixed(1)}%`
        : "0.0%",
    }));
  });

  return {
    rows: pointCostRows,
    total: pointCostTotal,
    average: pointCostAverage,
    averageDayCount: pointCostAverageDayCount,
    details: pointCostDetails,
  };
}
