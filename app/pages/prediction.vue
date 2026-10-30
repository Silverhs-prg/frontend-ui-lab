<script setup lang="ts">
import PredictionDemo from "../components/prediction/PredictionDemo.vue";
</script>

<template>
  <div class="prediction-page">
    <div class="prediction-page__container">
      <PredictionDemo />
    </div>
  </div>
</template>

<style scoped>
.prediction-page {
  width: 100%;
  background: #f3f5f7;
}

.prediction-page__container {
  width: 100%;
  max-width: none;
  margin-inline: auto;
  padding-inline: 16px;
}

@media (min-width: 768px) {
  .prediction-page__container {
    padding-inline: 24px;
  }
}

@media (min-width: 1200px) {
  .prediction-page__container {
    padding-inline: 32px;
  }
}

@media (min-width: 2000px) {
  .prediction-page__container {
    padding-inline: 40px;
  }
}
</style>
