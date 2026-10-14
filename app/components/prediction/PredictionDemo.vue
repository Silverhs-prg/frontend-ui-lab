<script setup lang="ts">
import SportMenu from "./SportMenu.vue";
import GameList from "./GameList.vue";
import BetPanel from "./bet/BetPanel.vue";
import { getGamesBySport } from "../../data/prediction";
import type {
  MarketMode,
  PredictionGame,
  PredictionOption,
  PredictionSelection,
  SportType,
} from "../../types/prediction";

const selectedGameType = ref<SportType>("TN");
const games = ref<PredictionGame[]>([]);
const isGamesLoading = ref(true);
const selections = ref<PredictionSelection[]>([]);
const isBetPanelOpen = ref(false);
const selectedOptionIds = computed(() => selections.value.map((selection) => selection.id));

const onSelectOption = (
  game: PredictionGame,
  mode: MarketMode,
  option: PredictionOption,
  submitMode?: MarketMode,
) => {
  if (!option.odd || !option.rawSpread || option.disabled) return;

  const optionId = [game.id, mode, option.oddType].join("_");
  const sameGameModeSelection = selections.value.find(
    (item) => item.gameId === game.id && item.mode === mode,
  );

  if (sameGameModeSelection?.id === optionId) {
    selections.value = selections.value.filter((item) => item.id !== optionId);
    return;
  }

  if (sameGameModeSelection) {
    selections.value = selections.value.filter(
      (item) => item.id !== sameGameModeSelection.id,
    );
  }

  selections.value.push({
    id: optionId,
    gameId: game.id,
    gameType: game.gameType,
    league: game.league,
    gDate: game.gDate,
    gTime: game.gTime,
    teamH: game.teamH,
    teamA: game.teamA,
    mode,
    submitMode,
    oddType: option.oddType,
    label: option.label,
    spread: option.spread,
    rawSpread: option.rawSpread,
    odd: option.odd,
  });
};

const removeSelection = (id: string) => {
  selections.value = selections.value.filter((selection) => selection.id !== id);
};

const toggleBetPanel = () => {
  isBetPanelOpen.value = !isBetPanelOpen.value;
};

const onSelectSport = (gameType: SportType) => {
  if (gameType === selectedGameType.value) return;
  selectedGameType.value = gameType;
  games.value = getGamesBySport(gameType);
};

onMounted(() => {
  games.value = getGamesBySport(selectedGameType.value);
  isGamesLoading.value = false;
});
</script>

<template>
  <section class="prediction-demo">
    <div class="prediction-demo__layout">
      <header class="prediction-demo__sports">
        <SportMenu
          :selected-game-type="selectedGameType"
          @select="onSelectSport"
        />
      </header>

      <main class="prediction-demo__browse">
        <GameList
          :games="games"
          :loading="isGamesLoading"
          :selected-option-ids="selectedOptionIds"
          @select-option="onSelectOption"
        />
      </main>

      <BetPanel
        class="prediction-demo__bet"
        :open="isBetPanelOpen"
        :selected-game-type="selectedGameType"
        :selections="selections"
        @toggle="toggleBetPanel"
        @remove="removeSelection"
      />
    </div>
  </section>
</template>

<style scoped>
.prediction-demo {
  width: 100%;
  min-height: calc(100dvh - 100px);
  padding-bottom: 80px;
  background: #f3f5f7;
  text-align: left;
}

.prediction-demo__layout {
  display: block;
}

.prediction-demo__sports {
  position: sticky;
  top: var(--prediction-sticky-top, 56px);
  z-index: 10;
  display: flex;
  align-items: center;
  padding-block: 6px;
  background: #f3f5f7;
}

.prediction-demo__browse {
  min-width: 0;
  min-height: 560px;
}



@media (min-width: 992px) {
  .prediction-demo {
    padding-bottom: 24px;
  }

  .prediction-demo__layout {
    display: grid;
    grid-template-areas: "sports bet" "browse bet";
    grid-template-columns: minmax(0, 1fr) minmax(300px, 330px);
    grid-template-rows: auto minmax(0, 1fr);
    align-items: start;
    column-gap: 12px;
    row-gap: 8px;
  }

  .prediction-demo__sports {
    grid-area: sports;
    padding-top: 20px;
    padding-bottom: 4px;
  }

  .prediction-demo__browse {
    grid-area: browse;
  }

  .prediction-demo__bet {
    grid-area: bet;
  }
}

@media (min-width: 1200px) {
  .prediction-demo__layout {
    grid-template-columns: minmax(0, 11fr) minmax(0, 4fr);
  }
}
</style>
