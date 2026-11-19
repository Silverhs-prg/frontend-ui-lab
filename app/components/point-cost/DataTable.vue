<script setup lang="ts">
import dayjs from "dayjs";
import { pointCostCategories } from "../../data/point-cost/config";
import type { PointCostSummary } from "../../types/point-cost";

const props = defineProps<{ pointCostSummary: PointCostSummary }>();
const pointCostRows = computed(() => props.pointCostSummary.total && props.pointCostSummary.average
  ? [props.pointCostSummary.total, props.pointCostSummary.average, ...[...props.pointCostSummary.rows].reverse()]
  : []);

const pointCostHeaders = [
  { title: "日期", key: "date", sortable: false, align: "start" as const, width: 180, minWidth: "180px", maxWidth: "180px" },
  ...pointCostCategories.map((pointCostCategory) => ({
    title: pointCostCategory.name,
    key: pointCostCategory.key,
    sortable: false,
    align: "end" as const,
    width: 113,
  })),
  { title: "支出總點數", key: "totalAmount", sortable: false, align: "end" as const, width: 128 },
];

const pointCostWeekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const pointCostFormatDate = (pointCostDate: string) =>
  pointCostDate === "總計" || pointCostDate === "平均"
    ? pointCostDate
    : `${pointCostDate.replaceAll("-", "/")} ${pointCostWeekdays[dayjs(pointCostDate).day()]}`;
const pointCostFormatAmount = (pointCostAmount: number) =>
  pointCostAmount.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
</script>

<template>
  <div class="point-cost-table" role="region" aria-label="每日點數支出明細" tabindex="0">
    <v-data-table
      :headers="pointCostHeaders"
      :items="pointCostRows"
      :items-per-page="-1"
      hide-default-footer
      fixed-header
      height="340"
      no-data-text="查無資料"
    >
      <template #item.date="{ item }">
        <span :class="{ 'point-cost-table__summary': item.date === '總計' || item.date === '平均' }">
          {{ pointCostFormatDate(item.date) }}
        </span>
      </template>
      <template v-for="pointCostCategory in pointCostCategories" :key="pointCostCategory.key" v-slot:[`item.${pointCostCategory.key}`]="{ item }">
        {{ pointCostFormatAmount(Number(item[pointCostCategory.key])) }}
      </template>
      <template #item.totalAmount="{ item }">
        {{ pointCostFormatAmount(Number(item.totalAmount)) }}
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
.point-cost-table { width: 100%; min-width: 0; overflow-x: auto; }
.point-cost-table :deep(.v-data-table) { min-width: 760px; }
.point-cost-table :deep(table) { width: 100%; table-layout: fixed; }
.point-cost-table :deep(.v-data-table td), .point-cost-table :deep(.v-data-table th) { height: 48px; padding-inline: 8px; font-size: 16px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.point-cost-table :deep(tr:has(.point-cost-table__summary) > td) { background: rgba(var(--v-theme-on-surface), 0.06) !important; }
.point-cost-table :deep(.v-data-table__th:first-child), .point-cost-table :deep(.v-data-table__td:first-child) { width: 180px !important; min-width: 180px !important; max-width: 180px !important; padding-inline: 4px; }
.point-cost-table :deep(.v-data-table__th:nth-child(n + 2):nth-child(-n + 5)), .point-cost-table :deep(.v-data-table__td:nth-child(n + 2):nth-child(-n + 5)) { width: calc((100% - 308px) / 4) !important; }
.point-cost-table :deep(.v-data-table__th:nth-child(6)), .point-cost-table :deep(.v-data-table__td:nth-child(6)) { width: 128px !important; }
.point-cost-table:focus-visible { outline: 2px solid #549f3c; outline-offset: 2px; }
</style>
