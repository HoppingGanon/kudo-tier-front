<template>
  <table style="width: 100%">
    <tr>
      <td class="minimum">
        <v-card flat>
          <p class="mt-2">
            <span v-if="pointType == 'stars'">総合：</span>
            <span v-else-if="pointType == 'rank7'">総合ランク：</span>
            <span v-else-if="pointType == 'rank14'">総合ランク：</span>
            <span v-else-if="pointType == 'score'">総合スコア：</span>
            <span v-else-if="pointType == 'point'">総合点：</span>
            <span v-else-if="pointType == 'unlimited'">合計：</span>
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
import { defineComponent, PropType } from 'vue'
import { ReviewPointType } from '@/common/review'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewLargeValue',
  components: {
    ReviewValueDisplay
  },
  props: {
    sum: {
      type: Number,
      required: true
    },
    average: {
      type: Number,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup () { }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
