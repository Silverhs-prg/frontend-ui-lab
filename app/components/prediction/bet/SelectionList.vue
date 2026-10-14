<template>
  <div class="bet-selection-list">
    <TransitionGroup
      name="slide-in-from-left"
      tag="div"
      class="bet-selection-list__items"
    >
      <article
        v-for="selection in props.selections"
        :key="selection.id"
        class="info-wrapper"
      >
        <header class="info-wrapper__header">
          <span class="league-tag">{{ selection.league }}</span>
          <button
            type="button"
            aria-label="移除選取"
            @click="emit('remove', selection.id)"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </header>

        <div class="match-row">
          <strong>
            <span>(主){{ selection.teamH }}</span>
            <span class="match-versus">VS</span>
            <span>{{ selection.teamA }}</span>
          </strong>
          <time :datetime="selection.gDate + 'T' + selection.gTime">{{ formatSelectionTime(selection.gDate, selection.gTime) }}</time>
        </div>

        <div class="bet-detail-row">
          <div class="bet-detail-left">
            <span class="bet-mode">{{ getModeLabel(selection.mode) }}</span>
            <span class="bet-option">
              {{ getSelectionTarget(selection.oddType, selection.teamH, selection.teamA) }}{{ selection.spread ? " " + selection.spread : "" }}
            </span>
          </div>
          <strong class="bet-odd">
            {{ formatOdds(selection.odd) }}
          </strong>
        </div>
      </article>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { MarketMode, PredictionSelection } from "../../../types/prediction";
import { formatOdds } from "../../../utils/prediction/formatOdds";
import { getMarketTitle } from "../../../utils/prediction/getMarketTitle";
import { getSelectionTarget } from "../../../utils/prediction/getSelectionTarget";

const props = defineProps<{ selections: PredictionSelection[] }>();
const emit = defineEmits<{ remove: [id: string] }>();

const getModeLabel = (mode: MarketMode) =>
  getMarketTitle(mode === "GameHA" ? "HA" : mode === "GameOU" ? "OU" : mode);

const formatSelectionTime = (date: string, time: string) => {
  const [month, day] = date.split("-").slice(1);
  const [hourText, minute = "00"] = time.split(":");
  const hour = Number(hourText);
  if (!month || !day || !Number.isFinite(hour)) return "";
  const hour12 = String(hour % 12 || 12).padStart(2, "0");
  return month + "." + day + " " + hour12 + ":" + minute + " " +
    (hour < 12 ? "上午" : "下午");
};
</script>

<style scoped lang="scss">


.bet-selection-list {
  min-height: 0;

  &__items {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
}

.info-wrapper {
  width: 100%;
  position: relative;
  margin-top: 8px;
  padding: 0 8px 8px;
  border: 2px solid #b9ddb0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: none;

  &__header {
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    button {
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 0;
      border-radius: 50%;
      background-color: transparent;
      color: #64666f;
      cursor: pointer;
    }
  }
}

.league-tag {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  min-height: 14px;
  display: flex;
  align-items: center;
  padding: 1px 8px;
  overflow: hidden;
  // 前一版「白底灰字灰框」：
  // border: 1px solid #d7ddd7;
  // background-color: transparent;
  // color: #3b3d3b;
  border: 1px solid #c6e7f5;
  border-radius: 12px;
  background-color: #f3fafe;
  color: #309ed1;
  font-size: 12px;
  line-height: 14px;
  // font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.match-row {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  color: #35384a;
  text-align: left;

  strong {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 800;

    > span:not(.match-versus) {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  time {
    flex-shrink: 0;
    margin-left: auto;
    color: #777d78;
    font-size: 12px;
    line-height: 16px;
  }
}

.match-versus {
  flex-shrink: 0;
  color: #64666f;
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
}

.bet-detail-row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #edf0ed;
}

.bet-detail-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1ch;
  color: #05852a;
  font-weight: bold;
}

.bet-option,
.bet-mode {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bet-mode {
  flex-shrink: 0;
}

.bet-odd {
  justify-self: end;
  color: #ed8a28;
  font-size: 17px;
  line-height: 21px;
  font-weight: bold;
  text-align: center;
}

@media (min-width: 1200px) {
  .bet-option,
  .bet-mode {
    font-size: 14px;
    line-height: 19px;
  }

  .bet-odd {
    font-size: 18px;
    line-height: 22px;
  }
}

@media (min-width: 1400px) {
  .bet-option,
  .bet-mode {
    font-size: 15px;
    line-height: 20px;
  }

  .bet-odd {
    font-size: 20px;
    line-height: 24px;
  }
}

@media (min-width: 1600px) {
  .bet-option,
  .bet-mode {
    font-size: 16px;
    line-height: 21px;
  }

  .bet-odd {
    font-size: 22px;
    line-height: 26px;
  }
}
.slide-in-from-left-enter-active,
.slide-in-from-left-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}

.slide-in-from-left-enter-from,
.slide-in-from-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
