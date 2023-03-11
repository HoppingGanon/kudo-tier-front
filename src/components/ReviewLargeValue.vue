<!-- レビューの評点を計算した結果を大きく表示するコンポーネント -->

<template>
  <table style="width: 100%">
    <tr>
      <td class="minimum">
        <v-card flat>
          <p class="mt-2">
            <span v-text="`${label} : `" />
          </p>
        </v-card>
      </td>
      <td style="width:auto">
        <review-value-display
          v-if="pointType === 'unlimited'"
          :point-type="pointType"
          :value="sum"
          display-size="large3"
        />
        <review-value-display
          v-else
          :point-type="pointType"
          :value="average"
          display-size="large3"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ReviewFunc, ReviewPointType } from '@/common/review'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewLargeValue',
  components: {
    ReviewValueDisplay
  },
  props: {
    /** 合計値 */
    sum: {
      type: Number,
      required: true
    },
    /** 重みを加味した合計値 */
    average: {
      type: Number,
      required: true
    },
    /** ポイント表示方法 */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    }
  },
  setup (props) {
    return {
      label: computed(() => ReviewFunc.getLergeDisplayLabel(props.pointType))
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
