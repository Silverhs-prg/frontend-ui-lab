<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "vue-chartjs";
import { pointCostCategories } from "../../data/point-cost/config";
import type { PointCostAmountKey, PointCostCategory, PointCostDay } from "../../types/point-cost";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const props = defineProps<{
  pointCostDays: PointCostDay[];
}>();

const pointCostLineOptions: PointCostCategory[] = [
  { key: "totalAmount", name: "每日總支出點數", color: "#F28C28" },
  ...pointCostCategories,
];
const pointCostSelectedLines = ref<PointCostAmountKey[]>(pointCostLineOptions.map((pointCostLine) => pointCostLine.key));
const pointCostNoneSelected = computed(() => pointCostSelectedLines.value.length === 0);
const pointCostToggleLine = (pointCostKey: PointCostAmountKey, pointCostChecked: boolean | null) => {
  if (pointCostChecked && !pointCostSelectedLines.value.includes(pointCostKey)) {
    pointCostSelectedLines.value = [...pointCostSelectedLines.value, pointCostKey];
  } else if (!pointCostChecked) {
    pointCostSelectedLines.value = pointCostSelectedLines.value.filter((pointCostLine) => pointCostLine !== pointCostKey);
  }
};
const pointCostClearLines = (pointCostChecked: boolean | null) => {
  if (pointCostChecked) pointCostSelectedLines.value = [];
};

const pointCostChartData = computed<ChartData<"line">>(() => ({
  labels: props.pointCostDays.map((day) => day.date.slice(5).replace("-", "/")),
  datasets: pointCostLineOptions
    .filter((pointCostLine) => pointCostSelectedLines.value.includes(pointCostLine.key))
    .map((pointCostLine) => ({
      label: pointCostLine.name,
      data: props.pointCostDays.map((pointCostDay) => pointCostDay[pointCostLine.key]),
      borderColor: pointCostLine.color,
      backgroundColor: pointCostLine.color,
      pointRadius: props.pointCostDays.length > 35 ? 0 : 2,
      pointHoverRadius: 5,
      tension: 0.2,
    })),
}));
const pointCostChartLabel = computed(() => {
  const start = props.pointCostDays[0]?.date;
  const end = props.pointCostDays.at(-1)?.date;
  return start && end ? `${start} 至 ${end} 每日點數支出折線圖，單位為點` : "每日點數支出折線圖";
});

const pointCostChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toLocaleString("zh-TW")} 點`,
      },
    },
  },
  scales: {
    x: {
      ticks: { autoSkip: true, maxTicksLimit: 8 },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${Number(value).toLocaleString("zh-TW")} 點`,
      },
    },
  },
};
</script>

<template>
  <div class="point-cost-line-chart-wrap">
    <div class="point-cost-line-chart__toggles" aria-label="折線圖顯示項目">
      <v-checkbox
        v-for="pointCostLine in pointCostLineOptions"
        :key="pointCostLine.key"
        class="point-cost-line-chart__checkbox"
        :style="{ '--line-color': pointCostLine.color }"
        :model-value="pointCostSelectedLines.includes(pointCostLine.key)"
        :label="pointCostLine.name"
        :color="pointCostLine.color"
        hide-details
        density="compact"
        @update:model-value="(pointCostChecked: boolean | null) => pointCostToggleLine(pointCostLine.key, pointCostChecked)"
      />
      <v-checkbox
        class="point-cost-line-chart__checkbox point-cost-line-chart__clear"
        :model-value="pointCostNoneSelected"
        label="消除選擇"
        color="grey"
        hide-details
        density="compact"
        @update:model-value="pointCostClearLines"
      />
    </div>
    <div v-if="pointCostDays.length && pointCostSelectedLines.length" class="point-cost-line-chart">
      <Line
        :data="pointCostChartData"
        :options="pointCostChartOptions"
        role="img"
        :aria-label="pointCostChartLabel"
      />
    </div>
    <div v-else class="point-cost-line-chart__empty">
      {{ pointCostDays.length ? "請勾選要顯示的金額" : "查無資料" }}
    </div>
  </div>
</template>

<style scoped>
.point-cost-line-chart-wrap { min-width: 0; }
.point-cost-line-chart__toggles { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
.point-cost-line-chart__toggles :deep(.v-checkbox) { flex: 0 0 auto; }
.point-cost-line-chart__toggles :deep(.v-selection-control) { min-height: 32px; }
.point-cost-line-chart__checkbox :deep(.v-selection-control__input .v-icon) { color: var(--line-color) !important; opacity: 1; }
.point-cost-line-chart__clear :deep(.v-label) { color: #9e9e9e; opacity: 1; }
.point-cost-line-chart__empty { display: grid; min-height: 300px; place-items: center; color: #53627c; }
.point-cost-line-chart {
  position: relative;
  width: 100%;
  min-width: 0;
  height: 340px;
}
</style>
