<template>
  <v-card width="100%" min-height="160px" >
    <v-container>
      <v-row class="align-center">
        <v-col>
          <review-header
            :icon-url="review.userIconUrl"
            :disp-name="review.userName"
            :last-write-time="lastWriteTime"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-h6">{{ review.name }}</p>
            <p class="text-subtitle-1"><b>{{ review.title }}</b></p>
            <p>
              <v-span v-if="review.pointType == 'stars'">総合：</v-span>
              <v-span v-else-if="review.pointType == 'rank7'">総合ランク：</v-span>
              <v-span v-else-if="review.pointType == 'rank14'">総合ランク：</v-span>
              <v-span v-else-if="review.pointType == 'score'">総合スコア：</v-span>
              <v-span v-else-if="review.pointType == 'point'">総合点：</v-span>
              <v-span v-else-if="review.pointType == 'unlimited'">合計：</v-span>
            </p>
            <review-value-display
              :point-type="review.pointType"
              :value="average"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'simple'">
        <v-col>
          <review-values
            :factors="review.reviewFactors"
            :display-type="displayType"
            :point-display-type="pointDisplayType"
            :point-type="review.pointType"
            :review-factor-params="review.reviewFactorParams"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'summary'">
        <v-col>
          <v-card class="ma-3" flat v-if="review.sections.length > 0">
            <section-component :section="review.sections[0]" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else-if="displayType === 'simple'">
        <v-col>
          <v-card class="ma-3" flat v-for="section,index in review.sections" :key="index">
            <section-component :section="section" />
            <v-divider v-if="index !== (review.sections.length - 1)" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Review, ReviewDisplayType, ReviewPointDisplayType, ReviewFactorParam } from '@/common/review'
import CommonApi from '@/common/commonapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'
import ReviewValueDisplay from './ReviewValueDisplay.vue'

export default defineComponent({
  name: 'ReviewCard',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues,
    ReviewValueDisplay
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    pointDisplayType: {
      type: Object as PropType<ReviewPointDisplayType>,
      required: true
    }
  },
  setup (props) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updateAt, true)
    })

    const average = computed(() => {
      let ave = 0
      let sumWeight = 0
      props.review.reviewFactorParams.forEach((param, index) => {
        if (param.isPoint && index < props.review.reviewFactors.length) {
          sumWeight += param.weight
        }
      })
      props.review.reviewFactorParams.forEach((param, index) => {
        if (param.isPoint && index < props.review.reviewFactors.length) {
          const factor = props.review.reviewFactors[index]
          if (factor.point !== undefined) {
            ave += factor.point * param.weight / sumWeight
          }
        }
      })
      return ave
    })

    return {
      lastWriteTime,
      average
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
