<script setup lang="ts">
import dayjs from "dayjs";
import DataTable from "./DataTable.vue";
import DoughnutChart from "./DoughnutChart.vue";
import LineChart from "./LineChart.vue";
import { makeMockPointCosts } from "../../data/point-cost/mock";
import { summarizePointCosts } from "../../utils/point-cost/summarize";
import type { PointCostDateRange } from "../../types/point-cost";

const pointCostDateOptions = ["最近7天", "最近30天", "最近90天", "最近180天", "自訂"] as const;
const pointCostToday = useState<string>("point-cost-today", () => dayjs().format("YYYY-MM-DD"));
const pointCostSelectedDate = ref<(typeof pointCostDateOptions)[number]>("最近7天");
const pointCostCustomStart = ref(dayjs(pointCostToday.value).subtract(29, "day").format("YYYY-MM-DD"));
const pointCostCustomEnd = ref(pointCostToday.value);

const pointCostDateRange = computed<PointCostDateRange>(() => {
  if (pointCostSelectedDate.value === "自訂") {
    return { startDate: pointCostCustomStart.value, endDate: pointCostCustomEnd.value };
  }
  const pointCostDayCount = pointCostSelectedDate.value === "最近7天" ? 7
    : pointCostSelectedDate.value === "最近90天" ? 90
    : pointCostSelectedDate.value === "最近180天" ? 180
    : 30;
  return {
    startDate: dayjs(pointCostToday.value).subtract(pointCostDayCount - 1, "day").format("YYYY-MM-DD"),
    endDate: pointCostToday.value,
  };
});

const pointCostSelectDate = (option: (typeof pointCostDateOptions)[number]) => {
  if (option === "自訂" && pointCostSelectedDate.value !== "自訂") {
    pointCostCustomStart.value = pointCostDateRange.value.startDate;
    pointCostCustomEnd.value = pointCostDateRange.value.endDate;
  }
  pointCostSelectedDate.value = option;
};

const pointCostMockDays = computed(() => makeMockPointCosts(pointCostToday.value));
const pointCostSummary = computed(() => summarizePointCosts(pointCostMockDays.value, pointCostDateRange.value));
const pointCostMockStart = computed(() => dayjs(pointCostToday.value).subtract(179, "day").format("YYYY-MM-DD"));
const pointCostDateLabel = computed(() =>
  `${pointCostDateRange.value.startDate.replaceAll("-", "/") || "—"}–${pointCostDateRange.value.endDate.replaceAll("-", "/") || "—"}`
);
const pointCostDateNote = computed(() => {
  const { startDate, endDate } = pointCostDateRange.value;
  if (!startDate || !endDate || startDate > endDate || !dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
    return "請選擇有效的日期區間，開始日期不可晚於結束日期。";
  }
  if (!pointCostSummary.value.rows.length) return "所選日期沒有資料。";
  if (startDate < pointCostMockStart.value || endDate > pointCostToday.value) {
    return "部分日期沒有資料。";
  }
  return "";
});
</script>

<template>
  <section class="point-cost-demo" aria-labelledby="point-cost-title">
    <header class="point-cost-demo__header">
      <h1 id="point-cost-title">點數支出報表</h1>
      <p>{{ pointCostDateLabel }}</p>
    </header>

    <div class="point-cost-demo__report">
      <div class="point-cost-demo__line-card point-cost-demo__card">
        <div class="point-cost-demo__controls">
          <div class="point-cost-demo__date-area" aria-label="日期篩選介面">
            <div class="point-cost-demo__date-options">
              <v-btn
                v-for="pointCostOption in pointCostDateOptions"
                :key="pointCostOption"
                :variant="pointCostSelectedDate === pointCostOption ? 'flat' : 'text'"
                :color="pointCostSelectedDate === pointCostOption ? '#6ec93b' : undefined"
                :aria-pressed="pointCostSelectedDate === pointCostOption"
                @click="pointCostSelectDate(pointCostOption)"
              >
                {{ pointCostOption }}
              </v-btn>
              <div v-if="pointCostSelectedDate === '自訂'" class="point-cost-demo__custom-dates">
                <label>開始日期 <input v-model="pointCostCustomStart" type="date" /></label>
                <label>結束日期 <input v-model="pointCostCustomEnd" type="date" /></label>
              </div>
            </div>
          </div>
        </div>
        <p v-if="pointCostDateNote" class="point-cost-demo__date-note" role="status">{{ pointCostDateNote }}</p>

        <section class="point-cost-demo__line-panel" aria-labelledby="point-cost-line-title">
          <h2 id="point-cost-line-title" class="point-cost-demo__sr-only">每日點數支出趨勢</h2>
          <ClientOnly>
            <LineChart :point-cost-days="pointCostSummary.rows" />
            <template #fallback>
              <div class="point-cost-demo__chart-fallback" role="status">圖表載入中…</div>
            </template>
          </ClientOnly>
        </section>
      </div>

      <div class="point-cost-demo__bottom">
        <section class="point-cost-demo__table-panel point-cost-demo__card" aria-labelledby="point-cost-table-title">
          <h2 id="point-cost-table-title" class="point-cost-demo__sr-only">每日支出明細</h2>
          <DataTable :point-cost-summary="pointCostSummary" />
        </section>
        <section class="point-cost-demo__doughnut-panel point-cost-demo__card" aria-labelledby="point-cost-doughnut-title">
          <h2 id="point-cost-doughnut-title" class="point-cost-demo__sr-only">支出類別分布</h2>
          <ClientOnly>
            <DoughnutChart :point-cost-summary="pointCostSummary" />
            <template #fallback>
              <div class="point-cost-demo__chart-fallback" role="status">圖表載入中…</div>
            </template>
          </ClientOnly>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.point-cost-demo { width: 100%; min-width: 0; font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif; text-align: left; }
.point-cost-demo__header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 24px; margin-bottom: var(--point-cost-header-gap, 18px); }
.point-cost-demo__header h1 { margin: 0; color: #26312a; font-size: clamp(26px, 3vw, 34px); line-height: 1.25; }
.point-cost-demo__header p { margin: 0; color: #58645b; font-size: 14px; line-height: 1.5; white-space: nowrap; }
.point-cost-demo__report { width: 100%; min-width: 0; }
.point-cost-demo__card { min-width: 0; border: 1px solid #d5ded6; border-radius: 10px; background: #fff; box-shadow: 0 3px 8px #0000001c; animation: point-cost-card-enter 360ms cubic-bezier(.16, 1, .3, 1) both; }
.point-cost-demo__line-card { padding: 16px 16px 8px; }
.point-cost-demo__table-panel { animation-delay: 70ms; }
.point-cost-demo__doughnut-panel { animation-delay: 140ms; }
.point-cost-demo__controls { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 8px 16px; }
.point-cost-demo__date-area { min-width: 0; }
.point-cost-demo__date-options { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; }
.point-cost-demo__date-options :deep(.v-btn) { min-width: 0; padding-inline: 12px; font-weight: 500; }
.point-cost-demo__date-options :deep(.v-btn[aria-pressed="true"]) { color: #183b14 !important; }
.point-cost-demo__custom-dates { display: flex; flex-wrap: wrap; align-items: center; min-width: 0; max-width: 100%; gap: 8px 16px; margin-left: 12px; }
.point-cost-demo__custom-dates label { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; color: #303633; font-size: 13px; }
.point-cost-demo__custom-dates input { max-width: 100%; padding: 5px 8px; border: 1px solid #b7c5d9; border-radius: 6px; background: #fff; color: #303633; font: inherit; }
.point-cost-demo__custom-dates input:focus-visible { outline: 2px solid #549f3c; outline-offset: 2px; }
.point-cost-demo__date-note { margin: 6px 0 0; color: #58645b; font-size: 12px; line-height: 1.5; }
.point-cost-demo__line-panel { min-width: 0; margin-top: 12px; }
.point-cost-demo__bottom { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; margin-top: 12px; }
.point-cost-demo__table-panel, .point-cost-demo__doughnut-panel { min-width: 0; padding: 8px; }
.point-cost-demo__chart-fallback { display: grid; min-height: 300px; place-items: center; color: #58645b; }
.point-cost-demo__sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
@media (min-width: 1280px) { .point-cost-demo__bottom { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } }
@keyframes point-cost-card-enter {
  from { opacity: .92; transform: translateY(8px); box-shadow: 0 1px 2px #00000010; }
  to { opacity: 1; transform: translateY(0); box-shadow: 0 3px 8px #0000001c; }
}
@media (prefers-reduced-motion: reduce) { .point-cost-demo__card { animation: none; } }
</style>
