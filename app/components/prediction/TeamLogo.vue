<script setup lang="ts">
const props = defineProps<{
  logo?: string;
  teamName: string;
}>();

const failed = ref(false);

watch(() => props.logo, () => { failed.value = false; });

const initials = computed(() => {
  const words = props.teamName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
  return Array.from(words[0] ?? "?").slice(0, 2).join("").toUpperCase();
});
</script>

<template>
  <span class="team-logo" :title="props.teamName">
    <img
      v-if="props.logo && !failed"
      :src="props.logo"
      :alt="props.teamName"
      @error="failed = true"
    />
    <span v-else class="team-logo__initials" aria-hidden="true">{{ initials }}</span>
  </span>
</template>

<style scoped>
.team-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eef3f7;
}

.team-logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-logo__initials {
  color: #31536a;
  font-size: clamp(9px, 0.7em, 13px);
  font-weight: 800;
  line-height: 1;
}
</style>
