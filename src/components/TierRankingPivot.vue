<template>
  <!-- スコアやランク表示 -->
  <div>
    <table
      width="100%"
      class="edge"
    >
      <tr v-for="items, i in tierPivotList" :key="i">
        <td v-if="pointType === 'point'" :style="pivotColor" style="width: 0px;white-space: nowrap;" :class="dark ? 'dark-left' : 'light-left'">
          <span :style="pivotColor" :class="dark ? 'dark-point' : 'light-point'" class="">
            {{ (9 - i)*10 }}点～{{ (10 - i)*10 }}点
          </span>
        </td>
        <td
          v-else-if="pointType === 'score'"
          :style="pivotColor"
          style="width: 0px;white-space: nowrap;"
          :class="'light-left'"
        >
          <review-value-display
            :point-type="pointType"
            :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
            :display-size="textSize"
            bar-width="100px"
            :reverse="reverse"
          />
        </td>
        <td
          v-else-if="pointType === 'stars'"
          :style="pivotColor"
          style="width: 0px;white-space: nowrap;"
          :class="dark ? 'dark-left' : 'light-left'"
        >
          <review-value-display
            :point-type="pointType"
            :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
            :display-size="textSize"
            bar-width="100px"
            :reverse="reverse"
          />
        </td>
        <td
          v-else-if="pointType === 'rank14' || pointType === 'rank7'"
          :style="pivotColor"
          style="width: 0px;white-space: nowrap;"
          :class="(reverse ? 'r-' + calcRankClass(pointType, calcPoint(i)) : (dark ? 'dark-left' : 'light-left'))"
        >
          <review-value-display
            :point-type="pointType"
            :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
            :display-size="textSize"
            bar-width="100px"
            :reverse="reverse"
          />
        </td>
        <td :style="pivotColor" style="min-width: 80%;" :class="dark ? 'dark-right' : 'light-right'">
          <div v-for="item,j in items" :key="j" style="display: inline-block;">
            <pivot-icon
              class="ma-1"
              :infomation="item"
              :size="iconSize"
              :point-type="pointType"
              :review-factor-params="params"
              />
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { PointDisplaySize, ReviewFactorParam, ReviewFunc, ReviewPointType, TierPivotInfomation } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'
import PivotIcon from '@/components/PivotIcon.vue'
import ReviewValueDisplay, { calcRankClass } from '@/components/ReviewValueDisplay.vue'

export type RankingTheme = 'light' | 'dark' | 'light-reverse' | 'dark-reverse'

export default defineComponent({
  name: 'TierRankingPivot',
  components: {
    PivotIcon,
    ReviewValueDisplay
  },
  props: {
    tierPivotList: {
      type: Array as PropType<TierPivotInfomation[][]>,
      reuired: true,
      default: () => [] as TierPivotInfomation[][]
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    iconSize: {
      type: String,
      default: '48px'
    },
    textSize: {
      type: String as PropType<PointDisplaySize>,
      default: 'large2'
    },
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      reuired: true,
      default: () => [] as ReviewFactorParam[]
    },
    theme: {
      type: String as PropType<RankingTheme>,
      default: 'light'
    }
  },
  emits: {},
  setup (props) {
    const pivotColor = ''

    return {
      calcRankClass,
      pivotColor,
      calcPoint: (index: number) => {
        const v = (props.tierPivotList.length - index - 1) * (100 / (props.tierPivotList.length - 1))
        return ReviewFunc.getReviewDisp(v, props.pointType)
      },
      reverse: computed(() => props.theme === 'dark-reverse' || props.theme === 'light-reverse'),
      dark: computed(() => props.theme === 'dark-reverse' || props.theme === 'dark')
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
@import url("@/style/rank.css");
.b-right {
  border-right: 1px solid #D3D3D3;
}
.card-h {
  height: -webkit-calc(100vh - 100px);
}

.dark-left {
  background-color: black;
}

.dark-right {
  background-color: black;
}

.dark-point {
  color: white;
}

.light-left {
  background-color: white;
}

.light-right {
  background-color: white;
}

.light-point {
  color: black;
}

.edge {
  background-color: gray;
}
</style>
