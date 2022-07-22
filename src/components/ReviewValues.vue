<template>
  <v-card flat>
    <v-card fluid flat>
      <v-card v-if="pointType == 'stars'" fluid flat>
        <review-value-display :value="100" :point-type="pointType" />
      </v-card>
    </v-card>
    <v-card v-if="displayType == 'simple'" fluid flat>
      <v-container fluid>
        <v-row v-for="factor, index in factors" :key="index">
          <v-col v-if="index < reviewFactorParams.length">
            <span v-if="index < reviewFactorParams.length" v-text="reviewFactorParams[index].name"></span>
          </v-col>
          <v-col v-if="index < reviewFactorParams.length">
            <review-value-display v-if="reviewFactorParams[index].isPoint && factor.point !== undefined" :value="factor.point" :point-type="pointType" />
            <span v-else-if="!reviewFactorParams[index].isPoint && factor.info !== undefined" v-text="factor.info"></span>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { ReviewFactor, ReviewPointType, ReviewPointDisplayType, ReviewDisplayType, ReviewFactorParam, ReviewFunc } from '@/common/review'
import { defineComponent, PropType, computed } from 'vue'
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
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    const getReviewDisp = ReviewFunc.getReviewDisp

    return {
      getReviewDisp
    }
  }
})
</script>
