<template>
  <div class="bet-panel-host">
    <button
      type="button"
      class="bet-panel__launcher"
      aria-label="Prediction Demo"
      :aria-expanded="props.open"
      aria-controls="prediction-demo-bet-panel"
      @click="emit('toggle')"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5V3h6v1.5M8 10h8M8 14h8M8 18h5"/></svg>
      <span v-if="selectionCount > 0" class="bet-panel__badge">
        {{ selectionCount }}
      </span>
    </button>

    <button
      v-if="props.open"
      type="button"
      class="bet-panel__scrim"
      aria-label="關閉"
      @click="emit('toggle')"
    ></button>

    <aside
      id="prediction-demo-bet-panel"
      class="bet-panel"
      :class="{ open: props.open }"
      :style="{ '--bet-panel-bg-image': `url(${panelBgUrl})` }"
      aria-label="Prediction Demo"
    >
      <div class="bet-panel__content">
        <header class="bet-panel__mobile-header">
          <strong>Prediction Demo</strong>
          <button
            type="button"
            aria-label="關閉"
            @click="emit('toggle')"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </header>

        <div
          class="bet-panel__list"
          :class="{ 'bet-panel__list--empty': selectionCount === 0 }"
        >
          <div v-if="selectionCount === 0" class="bet-panel__empty">
            <img
              :key="props.selectedGameType"
              class="bet-panel__empty-image"
              :src="panelBallUrl"
              alt=""
            />
            <p class="bet-panel__empty-title">暫無資料</p>
            <p class="bet-panel__empty-hint">請從左側賽事加入預測</p>
          </div>
          <SelectionList
            v-else
            :selections="props.selections"
            @remove="emit('remove', $event)"
          />
        </div>

        <footer class="bet-panel__summary">
          <div class="bet-panel__summary-row">
            <span>總預測點數</span>
            <strong class="bet-panel__summary-value">
              0 點數
            </strong>
          </div>
          <div class="bet-panel__summary-row bet-panel__summary-row--earn">
            <span>最高可贏得</span>
            <strong class="bet-panel__summary-value">
              0 點數
            </strong>
          </div>
          <div class="bet-panel__summary-actions">
            <button class="bet-panel__summary-submit" type="button" disabled>送出</button>
            <button class="bet-panel__summary-clear" type="button" disabled>刪除</button>
          </div>
        </footer>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import SelectionList from "./SelectionList.vue";
import type { PredictionSelection, SportType } from "../../../types/prediction";
import panelBallBk from "../../../assets/prediction/panel/Panel_ball_BK.png";
import panelBallSc from "../../../assets/prediction/panel/Panel_ball_SC.png";
import panelBallTn from "../../../assets/prediction/panel/Panel_ball_TN.png";
import panelDesktopBk from "../../../assets/prediction/panel/Panel_desktop_BK.png";
import panelDesktopSc from "../../../assets/prediction/panel/Panel_desktop_SC.png";
import panelDesktopTn from "../../../assets/prediction/panel/bet-panel-bg-desktop_02.png";

const props = defineProps<{
  open: boolean;
  selectedGameType: SportType;
  selections: PredictionSelection[];
}>();

const panelBgByGameType: Record<SportType, string> = {
  TN: panelDesktopTn,
  SC: panelDesktopSc,
  BK: panelDesktopBk,
};

const panelBallByGameType: Record<SportType, string> = {
  TN: panelBallTn,
  SC: panelBallSc,
  BK: panelBallBk,
};

const panelBgUrl = computed(() => panelBgByGameType[props.selectedGameType]);
const panelBallUrl = computed(() => panelBallByGameType[props.selectedGameType]);

const emit = defineEmits<{
  toggle: [];
  remove: [id: string];
}>();

const selectionCount = computed(() => props.selections.length);
</script>

<style scoped lang="scss">


.bet-panel-host {
  --prediction-color-primary-green: #67b99a;
  --prediction-color-primary-green-hover: #58aa8c;
  display: contents;
}

.bet-panel {
  width: 100%;
  height: min(76dvh, 680px);
  max-height: calc(100dvh - 40px);
  box-sizing: border-box;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  overflow: hidden;
  border: 1px solid #dfe3df;
  border-bottom: 0;
  border-radius: 18px 18px 0 0;
  background-color: #fff;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: var(--bet-panel-bg-image);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.4;
    pointer-events: none;
  }

  &.open {
    transform: translateY(0);
  }

  &__launcher {
    width: 52px;
    height: 52px;
    position: fixed;
    right: 20px;
    bottom: 60px;
    z-index: 79;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      #7bc5aa 0%,
      var(--prediction-color-primary-green) 55%,
      var(--prediction-color-primary-green-hover) 100%
    );
    color: #fff;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  &__badge {
    min-width: 21px;
    height: 21px;
    position: absolute;
    top: -7px;
    right: -5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border-radius: 11px;
    background-color: #d93666;
    color: #fff;
    font-size: 12px;
    line-height: 21px;
  }

  &__scrim {
    position: fixed;
    inset: 0;
    z-index: 70;
    border: 0;
    background-color: rgba(0, 0, 0, 0.32);
  }

  &__content {
    min-height: 0;
    height: 100%;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__mobile-header {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 8px 12px;
    border-bottom: 1px solid #e4e8e4;
    color: #35384a;

    button {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background-color: transparent;
      color: #64666f;
      cursor: pointer;
    }
  }

  &__list {
    min-height: 0;
    flex: 1;
    padding: 0 12px 12px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__list--empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  &__empty-image {
    display: block;
    width: 58%;
    max-width: 280px;
    height: auto;
    opacity: 0.68;
  }

  &__empty-title {
    margin: 6px 0 0;
    color: #173a63;
    font-weight: 600;
  }

  &__empty-hint {
    margin: 8px 0 0;
    color: #7d91aa;
    font-weight: 400;
  }

  &__summary {
    flex-shrink: 0;
    padding: 18px 14px 16px;
    border-top: 1px solid #e4e8e4;
    background-color: #f7f9f7;
  }

  &__summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    color: #64666f;
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;

    strong {
      color: #35384a;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }

    &--earn {
      color: #35384a;

      strong {
        color: #ed8a28;
      }
    }
  }

  &__summary-value {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
  }

  &__summary-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;
    margin-top: 16px;

    button {
      width: 100%;
      max-width: none;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 12px;
      font-family: inherit;
      font-weight: 700;
      opacity: 1;
      cursor: default;
      font-size: 16px;
      letter-spacing: 0.08em;
    }

    .bet-panel__summary-submit {
      color: #fff;
      background: linear-gradient(
        135deg,
        #7bc5aa 0%,
        var(--prediction-color-primary-green) 55%,
        var(--prediction-color-primary-green-hover) 100%
      );
      transition:
        background 0.2s ease,
        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: linear-gradient(
          135deg,
          #6fbea1 0%,
          #5eaf91 55%,
          #4f9f82 100%
        );
        opacity: 1;
      }
    }

    .bet-panel__summary-clear {
      color: #fff;
      background: linear-gradient(
        135deg,
        #ff6b95 0%,
        #ff4d7d 55%,
        #d93666 100%
      );
      border: 0;
      transition:
        background 0.2s ease,
        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: linear-gradient(
          135deg,
          #f25d88 0%,
          #f03d70 55%,
          #c42d5a 100%
        );
        opacity: 1;
      }
    }
  }
}

@media (max-width: 991px) {
  .bet-panel {
    &__empty-image {
      width: 45%;
      max-width: 190px;
    }

    &__empty-title {
      margin-top: 14px;
      font-size: 15px;
      line-height: 22px;
    }

    &__empty-hint {
      margin-top: 6px;
      font-size: 13px;
      line-height: 20px;
    }
  }
}

@media (min-width: 992px) {
  .bet-panel-host {
    grid-area: bet;
    height: calc(100dvh - var(--prediction-panel-sticky-top, 90px) - 16px);
    max-height: calc(100dvh - var(--prediction-panel-sticky-top, 90px) - 16px);
    display: block;
    position: sticky;
    top: var(--prediction-panel-sticky-top, 90px);
    align-self: start;
    overflow: hidden;
  }

  .bet-panel {
    height: 100%;
    max-height: 100%;
    position: relative;
    inset: auto;
    border-bottom: 1px solid #dfe3df;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: none;
    transition: none;

    &__launcher,
    &__scrim,
    &__mobile-header {
      display: none;
    }

    &__empty {
      transform: translateY(calc(-10dvh + 62px));
    }

    &__empty-image {
      transform: translateX(-6px);
    }
  }
}
</style>
