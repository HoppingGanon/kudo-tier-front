<template>
  <!-- スコアやランク表示 -->
  <table
    width="100%"
    class="edge"
  >
    <tr v-for="items, i in tierPivotList" :key="i">
      <td v-if="pointType === 'point'" :style="pivotColor" style="width: 0px;white-space: nowrap;" :class="dark ? 'dark-left' : 'light-left'">
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
        :class="dark ? 'dark-left' : 'light-left'"
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
import { IconSize, PointDisplaySize, RankingTheme, ReviewFactorParam, ReviewFunc, ReviewPointType, TierPivotInfomation } from '@/common/review'
import { computed, defineComponent, PropType } from 'vue'
import PivotIcon from '@/components/PivotIcon.vue'
import ReviewValueDisplay, { calcClass } from '@/components/ReviewValueDisplay.vue'

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
      type: String as PropType<IconSize>,
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
    },
    width: {
      type: String
    },
    directLink: {
      type: Boolean,
      default: false
    },
    pullingUp: {
      type: Number,
      required: true
    },
    pullingDown: {
      type: Number,
      required: true
    }
  },
  emits: {},
  setup (props) {
    const pivotColor = ''

    return {
      calcClass,
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
