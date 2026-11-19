<script setup lang="ts">
import PointCostDemo from "../components/point-cost/PointCostDemo.vue";

useHead({ title: "點數支出報表 | Silver UI Lab" });
</script>

<template>
  <div class="point-cost-page">
    <div class="point-cost-page__container">
      <PointCostDemo />
    </div>
  </div>
</template>

<style scoped>
.point-cost-page {
  width: 100%;
  min-width: 0;
  min-height: calc(100dvh - 84px);
  background: #e5eae5;
}

.point-cost-page__container {
  --point-cost-header-gap: 18px;
  width: 100%;
  max-width: 1800px;
  min-width: 0;
  margin-inline: auto;
  padding: var(--point-cost-header-gap) 16px 64px;
}

@media (min-width: 768px) {
  .point-cost-page__container {
    --point-cost-header-gap: 22px;
    padding: var(--point-cost-header-gap) 24px 72px;
  }
}

@media (min-width: 1200px) {
  .point-cost-page__container {
    padding-inline: 32px;
  }
}
</style>
