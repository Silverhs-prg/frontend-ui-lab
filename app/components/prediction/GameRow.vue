<template>
  <article class="game-row">
    <section class="game-row__info-column">
      <header class="game-row__header">
        <div class="game-row__league" :class="`sport-${props.game.gameType}`">
          {{ props.game.league }}
        </div>
      </header>

      <div class="game-row__game-detail">
        <div class="game-row__teams">
          <div class="game-row__team game-row__team--home">
            <span>(主){{ props.game.teamH }}</span>
          </div>

          <div class="game-row__match-center">
            <TeamLogo :logo="props.game.logoH" :team-name="props.game.teamH" class="game-row__logo game-row__logo--home" />
            <div class="game-row__score">
              <span
                v-if="props.game.status === 'inProgress'"
                class="status-shine"
              >
                {{ props.game.matchH }}-{{ props.game.matchA }}
              </span>
              <span
                v-else-if="props.game.status === 'pregame'"
                class="game-row__versus"
              >
                VS
              </span>
              <span v-else-if="props.game.status === 'final'">
                {{ props.game.matchH }}-{{ props.game.matchA }}
              </span>
              <span v-else>-</span>
            </div>
            <TeamLogo :logo="props.game.logoA" :team-name="props.game.teamA" class="game-row__logo game-row__logo--away" />
          </div>

          <div class="game-row__team game-row__team--away">
            <span>{{ props.game.teamA }}</span>
          </div>
        </div>

        <div
          v-if="props.game.status === 'inProgress'"
          class="game-row__live"
        >
          {{ `${inplayTime} ${matchDetail}` }}
        </div>
        <div v-else class="game-row__meta">
          <Countdown
            v-if="props.game.status === 'pregame'"
            class="game-row__countdown"
            :start-time="`${props.game.gDate} ${props.game.gTime}`"
          />
          <span v-else class="game-row__finish">
            {{ props.game.status === "final" ? "已結束" : "延期" }}
          </span>
          <time :datetime="`${props.game.gDate}T${props.game.gTime}`">
            <svg class="game-row__clock-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5l3 2M9 2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <span>
              {{ formatStartTime(props.game.gDate, props.game.gTime) }}
            </span>
          </time>
        </div>
      </div>
    </section>

    <section
      class="game-row__markets-column"
      :class="{
        'uses-three-column-layout': availableMarketModes.length <= 3,
      }"
    >
      <div class="game-row__market-tabs" role="tablist">
        <button
          v-for="mode in availableMarketModes"
          :key="mode"
          type="button"
          class="game-row__market-tab"
          role="tab"
          :class="{ 'is-active': mode === activeMarketMode }"
          :aria-selected="mode === activeMarketMode"
          @click="activeMarketMode = mode"
        >
          {{ getMarketTitle(mode) }}
        </button>
      </div>
      <div
        v-for="mode in availableMarketModes"
        :key="mode"
        class="game-row__market-group"
        :class="{
          three: getConditionCount(mode) === 3,
          'is-mobile-active': mode === activeMarketMode,
        }"
      >
        <span class="game-row__market-title">
          {{ getMarketTitle(mode) }}
        </span>
        <slot
          name="market"
          :game="props.game"
          :mode="mode"
          :market="getMarket(mode)"
        >
          <div
            class="game-row__conditions"
            :class="{ three: getConditionCount(mode) === 3 }"
          >
            <span
              v-for="option in getMarket(mode)?.options ?? []"
              :key="option.oddType"
              class="game-row__condition-placeholder"
              :data-testid="`predict-new-option-${props.game.id}-${mode}-${option.oddType}`"
              :class="{
                'is-home': option.oddType === 'H',
                'is-away': option.oddType === 'A',
                'is-tie': option.oddType === 'T',
                'is-over': option.oddType === 'O',
                'is-under': option.oddType === 'U',
                'is-selected': isOptionSelected(mode, option.oddType),
                'is-disabled': isOptionDisabled(option),
              }"
              @click="
                !isOptionDisabled(option) &&
                  emit(
                    'selectOption',
                    props.game,
                    mode,
                    option,
                    getMarket(mode)?.submitMode,
                  )
              "
            >
              <span class="game-row__condition-title">
                {{ option.label }}{{ option.spread ? ` ${option.spread}` : "" }}
              </span>
              <strong class="game-row__condition-odd">
                {{ formatOdds(option.odd) }}
              </strong>
            </span>
          </div>
        </slot>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import TeamLogo from "./TeamLogo.vue";
import Countdown from "./Countdown.vue";
import { formatOdds } from "../../utils/prediction/formatOdds";
import { getMarketTitle } from "../../utils/prediction/getMarketTitle";
import {
  PREDICTION_MARKET_MODES,
  type MarketMode,
  type PredictionGame,
  type PredictionOption,
} from "../../types/prediction";

const props = withDefaults(
  defineProps<{
    game: PredictionGame;
    selectedOptionIds?: string[];
  }>(),
  { selectedOptionIds: () => [] },
);

const emit = defineEmits<{
  selectOption: [
    game: PredictionGame,
    mode: MarketMode,
    option: PredictionOption,
    submitMode?: MarketMode,
  ];
}>();

const inplayTime = computed(
  () =>
    props.game.playByPlay?.Time?.split(":")
      .map((time) => time.padStart(2, "0"))
      .join(":") ?? "",
);
const matchDetail = computed(() => {
  const detail = Object.values(props.game.match_Detail ?? {})
    .map((match) => match.replaceAll(",", "-"))
    .join(", ");
  return detail ? `(${detail})` : "";
});
const getMarket = (mode: MarketMode) =>
  props.game.markets.find((market) => market.mode === mode);
const availableMarketModes = computed(() =>
  PREDICTION_MARKET_MODES.filter((mode) =>
    getMarket(mode)?.options.some((option) => Number(option.odd) > 0),
  ),
);
const activeMarketMode = ref<MarketMode | "">("");

watch(
  availableMarketModes,
  (modes) => {
    if (activeMarketMode.value && modes.includes(activeMarketMode.value)) return;
    activeMarketMode.value = modes[0] ?? "";
  },
  { immediate: true },
);

const getConditionCount = (mode: MarketMode) =>
  getMarket(mode)?.options.length || (mode === "1X2" ? 3 : 2);
const isOptionSelected = (mode: MarketMode, oddType: string) =>
  props.selectedOptionIds.includes(`${props.game.id}_${mode}_${oddType}`);
const isOptionDisabled = (option: PredictionOption) =>
  !!option.disabled || !option.odd || !option.rawSpread;

const formatStartTime = (date: string, time: string) => {
  const [month, day] = date.split("-").slice(1);
  const [hourText, minute = "00"] = time.split(":");
  const hour = Number(hourText);
  if (!month || !day || !Number.isFinite(hour)) return "";
  const hour12 = String(hour % 12 || 12).padStart(2, "0");
  return `${month}.${day} ${hour12}:${minute} ${hour < 12 ? "上午" : "下午"}`;
};
</script>

<style lang="scss" scoped>
.game-row {
  --prediction-color-navy: #122d4d;
  --prediction-color-orange: #ff5a00;
  min-width: 0;
  min-height: 172px;
  display: block;
  padding: 8px;
  border: 1px solid #d2dbd2;
  border-radius: 10px;
  background-color: #fff;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 252, 255, 0.98) 45%,
    rgba(239, 247, 255, 0.96) 100%
  );
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &__info-column {
    min-width: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 4px;
    padding: 6px;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      background-image: url("../../assets/prediction/gamerow/gamerow_leftdown_bg_01.png");
      background-repeat: no-repeat;
      background-position: left bottom;
      background-size: auto 120%;
      opacity: 0.58;
      filter: saturate(0.65);
      pointer-events: none;
    }
  }

  &__header {
    min-height: 28px;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  &__league {
    width: fit-content;
    max-width: 100%;
    min-width: 0;
    min-height: 16px;
    display: flex;
    align-items: center;
    padding: 2px 9px;
    border: 1px solid #c6e7f5;
    border-radius: 12px;
    background-color: #f3fafe;
    color: #309ed1;
    font-size: 12px;
    line-height: 16px;
    // font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__game-detail {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
    padding: 4px 0 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    text-align: center;

    time {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: #6f9b74;
      font-size: 14px;
      line-height: 16px;
      font-weight: bold;
    }
  }

  &__clock-icon {
    width: 14px;
    height: 14px;
    flex: none;
  }

  &__countdown {
    margin-bottom: 10px;
  }

  &__teams {
    min-width: 0;
    min-height: 42px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 3px;
  }

  &__team {
    min-width: 0;
    display: flex;
    align-items: center;
    color: #35384a;
    font-size: 13px;
    line-height: 17px;
    font-weight: bold;

    &--home {
      justify-content: flex-end;
      text-align: right;
    }

    &--away {
      justify-content: flex-start;
      text-align: left;
    }

    > span {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }

  &__match-center {
    display: flex;
    align-items: center;
    position: relative;
  }

  &__logo {
    width: 36px;
      height: 36px;
    display: none;
    overflow: hidden;

    @media (min-width: 361px) {
      display: block;
    }

    &--home {
      margin: auto 10px;
    }

    &--away {
      margin: auto 10px;
    }
  }

  &__score {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #35384a;
    font-size: 22px;
    line-height: 26px;
    font-weight: bold;
  }

  &__versus {
    min-width: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #35384a;
    font-family: "Arial Narrow", "Roboto Condensed", sans-serif;
    font-size: 14px;
    line-height: 16px;
    font-stretch: condensed;
    font-weight: 500;
    letter-spacing: 1px;
    transform: scaleX(0.82);

    @media (min-width: 361px) {
      min-width: 27px;
      font-size: 16px;
      line-height: 18px;
    }

    @media (min-width: 1400px) {
      font-size: 18px;
      line-height: 20px;
    }
  }

  &__live {
    margin-top: 6px;
    color: #6f9b74;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
  }

  &__finish {
    color: #35384a;
    font-size: 12px;
    line-height: 16px;
  }

  &__market-tabs {
    display: none;
  }

  &__markets-column {
    min-width: 0;
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #9aa29a #edf0ed;

    &::-webkit-scrollbar {
      display: block;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background-color: #edf0ed;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #9aa29a;
    }
  }

  &__market-group {
    min-width: 172px;
    flex: 0 0 172px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 34px 6px 8px;
    border: 1px solid #dfe4df;
    border-radius: 8px;
    background-color: #fafdff;
    background-image: linear-gradient(
      135deg,
      rgba(250, 253, 255, 0.98) 0%,
      rgba(232, 244, 254, 0.96) 55%,
      rgba(221, 237, 250, 0.94) 100%
    );

    &.three {
      min-width: 254px;
      flex-basis: 254px;
    }
  }

  &__market-title {
    position: absolute;
    top: 8px;
    left: 50%;
    z-index: 1;
    display: block;
    padding: 0;
    background-color: transparent;
    color: var(--prediction-color-navy);
    font-size: 16px;
    font-weight: 900;
    line-height: 22px;
    text-align: center;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  &__conditions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 0 6px;

    &.three {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__condition-placeholder {
    min-height: 56px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #d7ddd7;
    border-radius: 7px;
    background-color: #fff;
    background-image: linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);
    box-shadow: 0 2px 5px rgba(53, 56, 74, 0.12);
    transition:
      border-width 0.35s ease,
      transform 0.35s ease,
      box-shadow 0.35s ease;

    // 配色版本「三色第一版」：
    // 主隊／大：外框 #b9ddb0、底色 #eef8eb
    // 客隊／小：外框 #f2d7df、底色 #fff7f9
    // 和局：外框 #d9ddda、底色 #f4f5f4
    &.is-home,
    &.is-over,
    &.is-away,
    &.is-under,
    &.is-tie {
      border-color: #d7ddd7;
      background-color: #fff;
    }

    &.is-selected {
      border: 2px solid #05852a;

      &::after {
        width: 17px;
        height: 17px;
        position: absolute;
        top: -2px;
        right: -2px;
        display: flex;
        align-items: center;
        justify-content: center;
        content: "✓";
        border-radius: 0 6px 0 11px;
        background-color: #05852a;
        color: #fff;
        font-size: 10px;
        line-height: 17px;
        font-weight: bold;
      }
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.45;
      pointer-events: none;
      box-shadow: none;
    }
  }

  &__condition-title {
    color: var(--prediction-color-navy);
    font-size: 13px;
    line-height: 17px;
    font-weight: 800;
    text-align: center;
  }

  &__condition-odd {
    color: var(--prediction-color-orange);
    font-size: 15px;
    line-height: 18px;
    font-weight: bold;
  }

  .status-shine {
    animation: game-row-status-shine 0.6s linear infinite;
  }

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: minmax(210px, 22fr) minmax(0, 28fr);
    align-items: stretch;
    gap: 4px;

    &__info-column {
      width: auto;
      min-width: 0;
      margin-bottom: -8px;
      margin-left: -8px;
      padding-bottom: 14px;
      padding-left: 14px;
      border-bottom-left-radius: 9px;
    }

    &__team {
      font-size: 16px;
      line-height: 21px;
    }

    &__logo--home {
      margin-right: 20px;
    }

    &__logo--away {
      margin-left: 20px;
    }

    &__score {
      font-size: 25px;
    }

    &__markets-column {
      margin-top: 0;
      scrollbar-width: auto;

      &::-webkit-scrollbar {
        display: block;
      }
    }

    &__market-group {
      min-width: 180px;
      flex-basis: 180px;
      box-shadow: 0 3px 10px rgba(18, 45, 77, 0.16);

      &.three {
        min-width: 266px;
        flex-basis: 266px;
      }
    }

    &__condition-placeholder {
      min-height: 72px;
    }
  }

  @media (max-width: 991px) {
    margin-right: 8px;
    margin-left: 8px;
    border-color: #b9ddb0;

    &__info-column {
      padding: 3px 6px 6px;

      &::before {
        content: none;
      }
    }

    &__team {
      font-weight: 800;
    }

    &__teams {
      gap: 2px;
    }

    &__logo--home,
    &__logo--away {
      margin-right: 18px;
      margin-left: 18px;
    }

    &__header {
      min-height: 24px;
    }

    &__meta {
      flex-direction: row;
      gap: 10px;
      margin-top: 8px;
    }

    &__countdown {
      margin-bottom: 0;
    }

    &__league {
      padding: 1px 8px;
    }

    &__markets-column {
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
      padding-top: 0;
      padding-bottom: 0;
      overflow: visible;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__market-tabs {
      display: flex;
      gap: 8px;
    }

    &__market-tab {
      display: flex;
      flex: 1;
      min-width: 0;
      min-height: 36px;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 1px solid #c5dff0;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: #35384a;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;

      &.is-active {
        border: 2px solid #2d86c4;
        color: #fff;
        background: linear-gradient(
          135deg,
          #4aa3dc 0%,
          #2d86c4 55%,
          #1b6aa6 100%
        );
        box-shadow:
          0 0 0 1px rgba(136, 196, 235, 0.55),
          0 4px 12px rgba(45, 134, 196, 0.35),
          0 0 18px rgba(74, 163, 220, 0.45);
      }

      &:focus-visible {
        outline: 2px solid #2d86c4;
        outline-offset: 2px;
      }
    }

    &__market-group {
      display: none;
      width: 100%;
      min-width: 0;
      flex: none;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      background-image: none;
      box-shadow: none;

      &.three {
        min-width: 0;
        flex-basis: auto;
      }

      &.is-mobile-active {
        display: flex;
      }
    }

    &__market-title {
      display: none;
    }

    &__conditions {
      display: flex;
      gap: 10px;
      margin: 0;

      &.three {
        display: flex;
      }
    }

    &__condition-placeholder {
      flex: 1;
      min-width: 0;
      min-height: 58px;
      gap: 3px;
      padding: 8px 4px;
      border: 1.5px solid #eceef0;
      border-radius: 10px;
      background: #fff;
      background-image: none;
      box-shadow: none;
      transition: all 0.12s;

      &.is-home,
      &.is-over,
      &.is-away,
      &.is-under,
      &.is-tie {
        border: 1.5px solid #eceef0;
        background: #fff;
      }

      &:active {
        transform: scale(0.96);
      }

      &.is-selected {
        border: 1.5px solid #0f7a3f;
        background: #f2fbf5;

        &::after {
          display: none;
        }
      }
    }

    &__condition-title {
      max-width: 100%;
      overflow: hidden;
      color: #6b7079;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__condition-placeholder.is-selected &__condition-title {
      color: #0f7a3f;
      font-weight: 700;
    }

    &__condition-odd {
      color: #e8912a;
      font-size: 19px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      line-height: 23px;
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    grid-template-columns: minmax(240px, 23fr) minmax(0, 27fr);

    &__logo {
      width: 26px;
      height: 26px;
      margin-right: 6px;
      margin-left: 6px;
    }

    &__logo--home {
      margin-right: 10px;
    }

    &__logo--away {
      margin-left: 10px;
    }
  }

  @media (min-width: 992px) and (hover: hover) {
    &__condition-placeholder:hover {
      z-index: 1;
      border-width: 2px;
      box-shadow: 0 4px 9px rgba(53, 56, 74, 0.18);
      transform: scale(1.05);
    }
  }

  @media (min-width: 1200px) {
    &__condition-title {
      font-size: 15px;
      line-height: 19px;
    }
  }

  @media (min-width: 1400px) {
    &__team {
      font-size: 19px;
      line-height: 24px;
    }

    &__logo {
      width: 44px;
      height: 44px;
    }

    &__logo--home {
      margin-right: 24px;
      margin-left: 12px;
    }

    &__logo--away {
      margin-right: 12px;
      margin-left: 24px;
    }

    &__market-group {
      min-width: 0;
      flex: 2 1 0;

      &.three {
        min-width: 0;
        flex-basis: 0;
        flex-grow: 3;
      }
    }

    // 三種玩法以內共用三等分欄軌，缺少玩法時保留右側空位
    &__markets-column.uses-three-column-layout {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 2fr));
    }

    &__markets-column.uses-three-column-layout &__market-group {
      width: auto;
      min-width: 0;
      flex: none;

      &.three {
        min-width: 0;
        flex: none;
      }
    }

    &__conditions {
      gap: 6px;
      margin-right: 2px;
      margin-left: 2px;
    }
  }

  @media (min-width: 1600px) {
    &__logo {
      width: 52px;
      height: 52px;
    }

    &__condition-odd {
      font-size: 18px;
      line-height: 22px;
    }
  }
}

@keyframes game-row-status-shine {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.4;
  }
}
</style>
