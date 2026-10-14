<script setup lang="ts">
import type { SportType } from "../../types/prediction";

const props = defineProps<{
  selectedGameType: SportType;
}>();

const emit = defineEmits<{
  select: [gameType: SportType];
}>();

const sports: { type: SportType; title: string; subtitleEn: string }[] = [
  { type: "TN", title: "網球", subtitleEn: "Tennis" },
  { type: "SC", title: "足球", subtitleEn: "Soccer" },
  { type: "BK", title: "籃球", subtitleEn: "Basketball" },
];

// Keep the same local SVG contract as the previous stage. Missing files use text.
const availableIcons = import.meta.glob<string>(
  "../../assets/prediction/icons/*.svg",
  { eager: true, query: "?url", import: "default" },
);

const sportIconSrc: Record<SportType, string | undefined> = {
  TN: availableIcons["../../assets/prediction/icons/tn.svg"],
  SC: availableIcons["../../assets/prediction/icons/sc.svg"],
  BK: availableIcons["../../assets/prediction/icons/bk.svg"],
};
</script>

<template>
  <nav class="sport-menu" aria-label="球種選單">
    <button
      v-for="sport in sports"
      :key="sport.type"
      type="button"
      class="sport-menu__item"
      :class="{ active: props.selectedGameType === sport.type }"
      :aria-pressed="props.selectedGameType === sport.type"
      @click="emit('select', sport.type)"
    >
      <span class="sport-menu__icon" aria-hidden="true">
        <img v-if="sportIconSrc[sport.type]" :src="sportIconSrc[sport.type]" alt="" />
        <span v-else>{{ sport.type }}</span>
      </span>

      <span class="sport-menu__content">
        <strong>{{ sport.title }}</strong>
        <span class="sport-menu__abbr sport-menu__abbr--code">{{ sport.type }}</span>
        <span class="sport-menu__abbr sport-menu__abbr--en">{{ sport.subtitleEn }}</span>
      </span>
    </button>
  </nav>
</template>

<style scoped>
.sport-menu {
  display: grid;
  grid-auto-columns: 88px;
  grid-auto-flow: column;
  justify-content: start;
  gap: 6px;
  flex: 1;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  padding: 6px 8px 6px 0;
  scrollbar-width: none;
}

.sport-menu::-webkit-scrollbar {
  display: none;
}

.sport-menu__item {
  display: grid;
  grid-template-columns: 20px auto;
  align-items: center;
  justify-content: center;
  column-gap: 16px;
  width: 88px;
  height: 48px;
  padding: 4px 6px;
  border: 1px solid #b9ddb0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  color: #35384a;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease, transform 0.2s ease;
}

.sport-menu__item.active {
  border: 2px solid #2d86c4;
  background: linear-gradient(135deg, #4aa3dc 0%, #2d86c4 55%, #1b6aa6 100%);
  box-shadow: 0 0 0 1px rgb(136 196 235 / 55%),
    0 4px 12px rgb(45 134 196 / 35%), 0 0 18px rgb(74 163 220 / 45%);
  color: #fff;
}

.sport-menu__item:active {
  transform: scale(0.97);
}

.sport-menu__item:focus-visible {
  outline: 2px solid #2d86c4;
  outline-offset: 2px;
}

.sport-menu__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 9px;
  font-weight: 800;
}

.sport-menu__icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sport-menu__item.active .sport-menu__icon img {
  filter: brightness(0) invert(1);
}

.sport-menu__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}

.sport-menu__content strong,
.sport-menu__abbr {
  display: block;
  width: 100%;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sport-menu__content strong {
  font-size: 13px;
  line-height: 16px;
  font-weight: 800;
}

.sport-menu__abbr {
  color: #64666f;
  font-size: 10px;
  line-height: 12px;
  font-weight: 700;
}

.sport-menu__item.active .sport-menu__abbr {
  color: #fff;
}

.sport-menu__abbr--en {
  display: none;
}

@media (max-width: 991px) {
  .sport-menu {
    padding-left: 8px;
  }
}

@media (max-width: 768px) {
  .sport-menu__item {
    height: 44px;
  }
}

@media (min-width: 992px) {
  .sport-menu {
    grid-auto-columns: 172px;
    gap: 12px;
    padding: 0 10px 6px 0;
    scrollbar-width: thin;
    scrollbar-color: #9aa29a #edf0ed;
  }

  .sport-menu::-webkit-scrollbar {
    display: block;
    height: 6px;
  }

  .sport-menu::-webkit-scrollbar-track {
    border-radius: 3px;
    background: #edf0ed;
  }

  .sport-menu::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #9aa29a;
  }

  .sport-menu__item {
    grid-template-columns: 36px auto;
    column-gap: 12px;
    width: 172px;
    height: 66px;
    margin-top: 10px;
    padding: 8px 14px;
  }

  .sport-menu__item:not(.active):hover {
    border-color: #2d86c4;
    background: #eef6fc;
    transform: translateY(-3px);
  }

  .sport-menu__item.active:hover {
    box-shadow: 0 0 0 1px rgb(136 196 235 / 55%),
      0 6px 16px rgb(45 134 196 / 40%), 0 0 22px rgb(74 163 220 / 50%);
  }

  .sport-menu__icon {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .sport-menu__content {
    gap: 6px;
  }

  .sport-menu__content strong {
    font-size: 18px;
    line-height: 22px;
  }

  .sport-menu__abbr--code {
    display: none;
  }

  .sport-menu__abbr--en {
    display: block;
    font-size: 13px;
    line-height: 16px;
    text-transform: capitalize;
  }
}
</style>
