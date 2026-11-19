import dayjs from "dayjs";
import type { PointCostRawDay } from "../../types/point-cost";

function pointCostGeneratedDay(date: string): PointCostRawDay {
  const [year, month, day] = date.split("-").map(Number);
  const pointCostSeed = Math.floor(Date.UTC(year!, month! - 1, day!) / 86_400_000);
  const pointCostValue = (salt: number) =>
    pointCostSeed % 17 === salt % 17 ? 0 : ((pointCostSeed * 13 + salt * 7) % 29) * 20;

  return {
    date,
    serviceAmount: pointCostValue(1) * 10,
    contentAmount: pointCostValue(2) * 5,
    communityAmount: {
      postAmount: pointCostValue(4),
      commentAmount: pointCostValue(5),
      reactionAmount: pointCostValue(6),
    },
    platformAmount: {
      checkInAmount: pointCostValue(7),
      taskAmount: pointCostValue(8) * 2,
      referralAmount: pointCostValue(9),
    },
  };
}

/** 以日期決定數值；同一天重新整理後會得到相同的展示資料。 */
export function makeMockPointCosts(today = dayjs().format("YYYY-MM-DD")): PointCostRawDay[] {
  return Array.from({ length: 180 }, (_, index) => {
    const date = dayjs(today).subtract(179 - index, "day").format("YYYY-MM-DD");
    return pointCostGeneratedDay(date);
  });
}
