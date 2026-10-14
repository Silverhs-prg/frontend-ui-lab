<template>
  <section
    class="game-list"
    data-testid="predict-new-game-list"
    :aria-busy="props.loading"
  >
    <div v-if="props.loading" class="game-list__loading">
      <div v-for="index in 4" :key="index" class="game-list__skeleton">
        <span></span>
        <span></span>
      </div>
    </div>

    <EmptyState
      v-else-if="props.games.length === 0"
      class="game-list__empty"
    />

    <div v-else class="game-list__rows">
      <GameRow
        v-for="game in props.games"
        :key="game.id"
        :game="game"
        :selected-option-ids="props.selectedOptionIds"
        @select-option="onSelectOption"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import GameRow from "./GameRow.vue";
import EmptyState from "./EmptyState.vue";
import type { MarketMode, PredictionGame, PredictionOption } from "../../types/prediction";

interface IGameListProps {
  games: PredictionGame[];
  loading?: boolean;
  selectedOptionIds?: string[];
}

const props = withDefaults(defineProps<IGameListProps>(), {
  loading: false,
  selectedOptionIds: () => [],
});

const onSelectOption = (
  game: PredictionGame,
  mode: MarketMode,
  option: PredictionOption,
  submitMode?: MarketMode,
) => {
  emit("selectOption", game, mode, option, submitMode);
};

const emit = defineEmits<{
  selectOption: [
    game: PredictionGame,
    mode: MarketMode,
    option: PredictionOption,
    submitMode?: MarketMode,
  ];
}>();
</script>

<style lang="scss" scoped>
.game-list {
  min-width: 0;

  &__rows,
  &__loading {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__skeleton {
    min-height: 172px;
    display: grid;
    grid-template-rows: 24px 1fr;
    gap: 8px;
    padding: 8px;
    border: 1px solid #edf0ed;
    border-radius: 12px;
    background-color: #fff;

    span {
      display: block;
      border-radius: 8px;
      background: linear-gradient(90deg, #f2f4f2 25%, #fafbfa 50%, #f2f4f2 75%);
      background-size: 200% 100%;
      animation: game-list-loading 1.4s infinite linear;
    }
  }

  &__empty {
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes game-list-loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-list__skeleton span {
    animation: none;
  }
}
</style>
