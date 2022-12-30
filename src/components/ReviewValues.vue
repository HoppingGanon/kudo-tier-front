<template>
  <v-container fluid>
    <!-- レビューの評点や文字列情報を表示 -->
    <v-row v-for="factor, index in factors" :key="index" dense>
      <v-col
        v-if="index < reviewFactorParams.length"
        class="no-break"
        :class="$vuetify.display.xs ? 'text-caption' : ''"
        style="text-align: end;"
        cols="4"
        sm="4"
        md="4"
        lg="3"
        xl="2"
      >
        <span v-if="index < reviewFactorParams.length" v-text="`${reviewFactorParams[index].name} : `"></span>
      </v-col>
      <v-col
        v-if="index < reviewFactorParams.length"
        cols="8"
        sm="8"
        md="8"
        lg="9"
        xl="10"
      >
        <review-value-display
          v-if="reviewFactorParams[index].isPoint && factor.point !== undefined"
          :display-size="$vuetify.display.xs ? 'smaller' : 'normal'"
          :value="factor.point"
          :point-type="pointType"
        />
        <span
          v-else-if="!reviewFactorParams[index].isPoint && factor.info !== undefined"
          class="break-word"
          v-text="factor.info"
          :class="$vuetify.display.xs ? 'text-caption' : ''"
        />
      </v-col>
    </v-row>
  </v-container>
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
      type: Array as PropType<ReviewFactor[]>,
      required: true
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    pointDisplayType: {
      type: String as PropType<ReviewPointDisplayType>,
      default: 'normal' as ReviewPointDisplayType
    },
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
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
