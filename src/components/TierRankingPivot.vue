<!-- ピボットTierを表示するコンポーネント -->

<template>
  <!-- スコアやランク表示 -->
  <table
    width="100%"
    class="edge"
  >
    <tr v-for="items, i in tierPivotList" :key="i">
      <td
        v-if="pointType === 'point'"
        :style="pivotColor"
        style="width: 0px;white-space: nowrap;"
        :class="reverse ? calcColor(pointType, (tierPivotList.length - i) * 10) : (dark ? 'dark-left' : 'light-left')"
      >
        <review-value-display
          :point-type="pointType"
          :value="(tierPivotList.length - i) * 10"
          :display-size="textSize"
          :reverse="reverse"
        />
      </td>
      <td
        v-else-if="pointType === 'score'"
        style="width: 0px;height: 100%;white-space: nowrap;"
        :class="reverse ? calcColor(pointType, 10 - i) : (dark ? 'dark-left' : 'light-left')"
      >
        <review-value-display
          :point-type="pointType"
          :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
          :display-size="textSize"
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
          :reverse="reverse"
        />
      </td>
      <td
        v-else-if="pointType === 'rank14' || pointType === 'rank7'"
        :style="pivotColor"
        style="width: 0px;white-space: nowrap;"
        :class="reverse ? calcColor(pointType, tierPivotList.length - i - 1) : (dark ? 'dark-left' : 'light-left')"
      >
        <review-value-display
          :point-type="pointType"
          :value="(tierPivotList.length - i - 1) * (100 / (tierPivotList.length - 1))"
          :display-size="textSize"
          :reverse="reverse"
        />
      </td>
      <td :style="pivotColor" style="" :class="dark ? 'dark-right' : 'light-right'">
        <div v-for="item,j in items" :key="j" style="display: inline-block;" class="ma-1">
          <pivot-icon
            :infomation="item"
            :size="iconSize"
            :point-type="pointType"
            :review-factor-params="params"
            :direct-link="directLink"
            :pulling-up="pullingUp"
            :pulling-down="pullingDown"
            />
        </div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { IconSize, PointDisplaySize, RankingTheme, ReviewFactorParam, ReviewPointType, TierPivotInfomation } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'
import PivotIcon from '@/components/PivotIcon.vue'
import ReviewValueDisplay, { calcColor } from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'TierRankingPivot',
  components: {
    PivotIcon,
    ReviewValueDisplay
  },
  props: {
    /** ピボット済の計算済みレビューリスト */
    tierPivotList: {
      type: Array as PropType<TierPivotInfomation[][]>,
      reuired: true,
      default: () => [] as TierPivotInfomation[][]
    },
    /** ポイント表示タイプ */
    pointType: {
      type: String as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    },
    /** ピボットTierのアイコンのサイズ */
    iconSize: {
      type: String as PropType<IconSize>,
      default: '48px'
    },
    /** ピボットTierの評点のサイズ */
    textSize: {
      type: String as PropType<PointDisplaySize>,
      default: 'large2'
    },
    /** レビューの評価項目 */
    params: {
      type: Array as PropType<ReviewFactorParam[]>,
      reuired: true,
      default: () => [] as ReviewFactorParam[]
    },
    /** ピボットTierのテーマ */
    theme: {
      type: String as PropType<RankingTheme>,
      default: 'light'
    },
    /** ピボットTierの幅 */
    width: {
      type: String
    },
    /** クリックするとレビュー単独のページに飛ぶ */
    directLink: {
      type: Boolean,
      default: false
    },
    /** Tier調整値 */
    pullingUp: {
      type: Number,
      required: true
    },
    /** Tier調整値 */
    pullingDown: {
      type: Number,
      required: true
    }
  },
  emits: {},
  setup (props) {
    const pivotColor = ''

    return {
      calcColor,
      pivotColor,
      reverse: computed(() => props.theme === 'dark-reverse' || props.theme === 'light-reverse'),
      dark: computed(() => props.theme === 'dark-reverse' || props.theme === 'dark'),
      divStyle: computed(() => props.width === undefined ? '' : `width: ${props.width};`)
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
