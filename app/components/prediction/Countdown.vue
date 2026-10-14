<script setup lang="ts">
const props = defineProps<{
  startTime: string;
}>();

const remaining = ref("");
let timer: ReturnType<typeof setInterval> | undefined;

const update = () => {
  const target = new Date(props.startTime.replace(" ", "T")).getTime();
  if (!Number.isFinite(target)) {
    remaining.value = "";
    return;
  }
  const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  remaining.value = `${pad(hours)}:${pad(minutes)}:${pad(rest)}`;
};

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
});
watch(() => props.startTime, () => { if (import.meta.client) update(); });
onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <span class="countdown">{{ remaining }}</span>
</template>

<style scoped>
.countdown {
  display: none;
  color: #64666f;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

@media (min-width: 361px) {
  .countdown { display: block; }
}
</style>
