<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, type ChartData, type ChartOptions, type Plugin } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { pointCostCategories } from "../../data/point-cost/config";
import type { PointCostSummary } from "../../types/point-cost";

ChartJS.register(ArcElement, Tooltip);

const props = defineProps<{
  pointCostSummary: PointCostSummary;
}>();

const pointCostDetails = computed(() => props.pointCostSummary.details);
const pointCostDetailGroups = computed(() => pointCostCategories.map((category) => ({
  key: category.key,
  details: pointCostDetails.value.filter((detail) => detail.parent === category.key),
})).filter((group) => group.details.length));
const pointCostPositiveDetails = computed(() => pointCostDetails.value.filter((detail) => detail.amount > 0));
const pointCostTotal = computed(() => props.pointCostSummary.total?.totalAmount ?? 0);
const pointCostChartData = computed<ChartData<"doughnut">>(() => ({
  labels: pointCostPositiveDetails.value.map((pointCostDetail) => pointCostDetail.name),
  datasets: [{
    data: pointCostPositiveDetails.value.map((pointCostDetail) => pointCostDetail.amount),
    backgroundColor: pointCostPositiveDetails.value.map((pointCostDetail) => pointCostDetail.color),
    borderColor: "#fff",
    borderWidth: 2,
  }],
}));

const pointCostChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "57%",
  layout: { padding: 2 },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${Number(context.parsed).toLocaleString("zh-TW")} 點`,
      },
    },
  },
};

const pointCostSlicePercentPlugin: Plugin<"doughnut"> = {
  id: "pointCostSlicePercent",
  afterDatasetsDraw(chart) {
    const dataset = chart.data.datasets[0];
    if (!dataset) return;
    const values = dataset.data.map((value) => typeof value === "number" ? value : Number(value) || 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return;

    const { ctx } = chart;
    chart.getDatasetMeta(0).data.forEach((element, index) => {
      const value = values[index] ?? 0;
      if (value <= 0 || !(element instanceof ArcElement)) return;
      const { x, y, startAngle, endAngle, innerRadius, outerRadius } = element;
      const thickness = outerRadius - innerRadius;
      if (thickness < 12) return;

      const fontSize = Math.round(Math.min(14, Math.max(11, thickness * 0.32)));
      const label = `${(value / total * 100).toFixed(1)}%`;
      const center = element.getCenterPoint(false);
      ctx.save();
      ctx.font = `600 ${fontSize}px "Segoe UI", "Microsoft JhengHei", sans-serif`;
      const halfWidth = ctx.measureText(label).width / 2 + 2;
      const halfHeight = fontSize / 2 + 1;
      const corners: [number, number][] = [
        [center.x - halfWidth, center.y - halfHeight],
        [center.x + halfWidth, center.y - halfHeight],
        [center.x - halfWidth, center.y + halfHeight],
        [center.x + halfWidth, center.y + halfHeight],
      ];
      if (corners.every(([cornerX, cornerY]) => pointCostPointInSlice(
        cornerX, cornerY, x, y, startAngle, endAngle, innerRadius, outerRadius,
      ))) {
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, center.x, center.y);
      }
      ctx.restore();
    });
  },
};

function pointCostPointInSlice(
  x: number, y: number, centerX: number, centerY: number,
  startAngle: number, endAngle: number, innerRadius: number, outerRadius: number,
) {
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.hypot(dx, dy);
  const inset = 1.5;
  if (distance < innerRadius + inset || distance > outerRadius - inset) return false;
  const tau = Math.PI * 2;
  const sweep = endAngle - startAngle;
  if (sweep >= tau - 0.001) return true;
  const delta = ((Math.atan2(dy, dx) - startAngle) % tau + tau) % tau;
  const limit = ((sweep % tau) + tau) % tau;
  return delta <= limit + 0.001;
}
</script>

<template>
  <div class="point-cost-doughnut">
    <div v-if="pointCostPositiveDetails.length" class="point-cost-doughnut__chart">
      <Doughnut
        :data="pointCostChartData"
        :options="pointCostChartOptions"
        :plugins="[pointCostSlicePercentPlugin]"
        role="img"
        aria-label="點數支出類別分布圓環圖"
      />
      <div class="point-cost-doughnut__center" aria-hidden="true">
        <span>總支出點數</span>
        <strong>{{ pointCostTotal.toLocaleString("zh-TW") }}</strong>
        <span>點</span>
      </div>
    </div>
    <div v-else class="point-cost-doughnut__empty">
      {{ pointCostSummary.rows.length ? "沒有可繪製的正數細項" : "查無資料" }}
    </div>

    <div class="point-cost-doughnut__details">
      <div class="point-cost-doughnut__columns" aria-hidden="true">
        <span>支出類別</span>
        <span>數量／佔比</span>
      </div>
      <div class="point-cost-doughnut__list" aria-label="點數支出細項">
        <div v-for="pointCostGroup in pointCostDetailGroups" :key="pointCostGroup.key" class="point-cost-doughnut__group">
          <div v-for="pointCostDetail in pointCostGroup.details" :key="pointCostDetail.key" class="point-cost-doughnut__row">
            <span class="point-cost-doughnut__name">
              <span class="point-cost-doughnut__swatch" :style="{ backgroundColor: pointCostDetail.color }" />
              {{ pointCostDetail.name }}
            </span>
            <span class="point-cost-doughnut__metric">
              {{ pointCostDetail.amount.toLocaleString("zh-TW") }}
              <small>{{ pointCostDetail.percent }}</small>
            </span>
          </div>
        </div>
        <div v-if="!pointCostDetails.length" class="point-cost-doughnut__row">查無細項資料</div>
      </div>
      <div v-if="pointCostSummary.total" class="point-cost-doughnut__total">
        <strong>總計</strong>
        <strong>{{ pointCostTotal.toLocaleString("zh-TW") }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.point-cost-doughnut { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; min-width: 0; }
.point-cost-doughnut__chart { position: relative; width: min(100%, 300px); aspect-ratio: 1; justify-self: center; margin-top: 20px; container-type: inline-size; }
.point-cost-doughnut__chart :deep(canvas) { position: absolute; inset: 0; width: 100% !important; height: 100% !important; }
.point-cost-doughnut__empty { display: grid; min-height: 220px; place-items: center; color: #53627c; font-size: 13px; text-align: center; }
.point-cost-doughnut__center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; pointer-events: none; color: #303633; text-align: center; }
.point-cost-doughnut__center span { max-width: 50%; font-size: clamp(11px, 4.2cqi, 14px); line-height: 1.2; opacity: .72; }
.point-cost-doughnut__center strong { max-width: 52%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: clamp(15px, 7.2cqi, 24px); line-height: 1.15; font-variant-numeric: tabular-nums; }
.point-cost-doughnut__details { display: flex; flex-direction: column; min-width: 0; margin-right: 16px; }
.point-cost-doughnut__columns, .point-cost-doughnut__row, .point-cost-doughnut__total { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.point-cost-doughnut__columns { padding: 4px 0 8px; border-bottom: 1px solid #d5dad5; color: #303633; font-size: 14px; font-weight: 600; }
.point-cost-doughnut__list { height: 266px; overflow-y: auto; scrollbar-gutter: stable; padding-inline-end: 8px; }
.point-cost-doughnut__group { padding-block: 7px; border-bottom: 1px solid #d5dad5; }
.point-cost-doughnut__row { min-height: 40px; padding-block: 2px; color: #303633; font-size: 15px; font-variant-numeric: tabular-nums; }
.point-cost-doughnut__name { display: flex; align-items: center; gap: 6px; min-width: 0; }
.point-cost-doughnut__swatch { width: 10px; height: 10px; border-radius: 2px; flex: none; }
.point-cost-doughnut__metric { display: flex; flex-direction: column; align-items: flex-end; white-space: nowrap; font-variant-numeric: tabular-nums; }
.point-cost-doughnut__metric small { color: #687168; font-size: 13px; font-weight: 500; }
.point-cost-doughnut__total { margin-top: 8px; padding: 8px 10px; border-radius: 6px; background: #f1f8ed; color: #303633; font-size: 15px; font-variant-numeric: tabular-nums; }
@media (min-width: 560px) { .point-cost-doughnut { grid-template-columns: minmax(0, 1fr) 240px; align-items: start; } }
@media (max-width: 559px) { .point-cost-doughnut__row { font-size: 14px; } }
</style>
