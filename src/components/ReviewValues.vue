<template>
  <v-card flat>
    <v-card v-if="displayType == 'all'" flat max-width="640px">
      <v-container>
        <!-- レビューの評点や文字列情報を表示 -->
        <v-row v-for="factor, index in factors" :key="index">
          <v-col v-if="index < reviewFactorParams.length" style="text-align: end;" class="no-break">
            <span v-if="index < reviewFactorParams.length" v-text="reviewFactorParams[index].name"></span>
          </v-col>
          <v-col v-if="index < reviewFactorParams.length">
            <review-value-display v-if="reviewFactorParams[index].isPoint && factor.point !== undefined" :value="factor.point" :point-type="pointType" />
            <span v-else-if="!reviewFactorParams[index].isPoint && factor.info !== undefined" class="break-word" v-text="factor.info"></span>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { ReviewFactor, ReviewPointType, ReviewPointDisplayType, ReviewDisplayType, ReviewFactorParam, ReviewFunc } from '@/common/review'
import { defineComponent, PropType } from 'vue'
import ReviewValueDisplay from './ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewValues',
  components: {
    ReviewValueDisplay
  },
  props: {
    factors: {
      type: Object as PropType<ReviewFactor[]>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    },
    pointDisplayType: {
      type: Object as PropType<ReviewPointDisplayType>,
      default: 'normal' as ReviewPointDisplayType
    },
    reviewFactorParams: {
      type: Object as PropType<ReviewFactorParam[]>,
      required: true
    }
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePointType: (value: ReviewPointType) => true
  },
  setup () {
    const getReviewDisp = ReviewFunc.getReviewDisp

    return {
      getReviewDisp
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
