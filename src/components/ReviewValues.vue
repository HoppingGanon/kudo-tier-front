<!-- ポイントを並べて表示するコンポーネント -->
<template>
  <v-container fluid>
    <!-- レビューの評点や文字列情報を表示 -->
    <v-row v-for="factor, index in factors" :key="index" dense>
      <v-col
        v-if="index < reviewFactorParams.length"
        class="no-break"
        :class="$vuetify.display.xs ? 'text-caption' : ''"
        style="text-align: start;"
        cols="4"
        sm="4"
        md="4"
        lg="4"
        xl="4"
      >
        <span v-if="index < reviewFactorParams.length" v-text="reviewFactorParams[index].name"></span>
      </v-col>
      <v-col
        v-if="index < reviewFactorParams.length"
        class="d-flex"
      >
        <div class="ml-1 mr-2">:</div>
        <div style="width: 100%">
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
          ></span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReviewFactor, ReviewPointType, ReviewDisplayType, ReviewFactorParam, ReviewFunc } from '@/common/review'
import { defineComponent, PropType } from 'vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewValues',
  components: {
    ReviewValueDisplay
  },
  props: {
    /** レビュー評点や情報 */
    factors: {
      type: Array as PropType<ReviewFactor[]>,
      required: true
    },
    /** レビューの表示方法 */
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    /** ポイント表示方法 */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    /** レビュー評価項目 */
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    }
  },
  emits: {
    /**
     * ポイント表示方法の更新イベント
     * @param value ポイント表示方法
     */
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
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
