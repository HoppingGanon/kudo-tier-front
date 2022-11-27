<template>
  <v-card :width="width" :min-height="minHeight" >
    <v-container>
      <v-row class="align-center">
        <v-col>
          <review-header
            v-if="!noHeader"
            :icon-url="review.userIconUrl"
            :disp-name="review.userName"
            :user-link="baseLink + review.userId"
            :last-write-time="lastWriteTime"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-subtitle-1"><span v-text="review.name"></span></p>
            <p class="text-h6"><b><span v-text="review.title"></span></b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <v-card flat>
            <p class="mt-2">
              <span v-if="getPointType() == 'stars'">総合：</span>
              <span v-else-if="getPointType() == 'rank7'">総合ランク：</span>
              <span v-else-if="getPointType() == 'rank14'">総合ランク：</span>
              <span v-else-if="getPointType() == 'score'">総合スコア：</span>
              <span v-else-if="getPointType() == 'point'">総合点：</span>
              <span v-else-if="getPointType() == 'unlimited'">合計：</span>
            </p>
          </v-card>
        </v-col>
        <v-col cols="2" v-if="!noChangePoint">
          <point-type-selector
            :model-value="pointType"
            @update="$emit('updatePointType', $event)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <review-value-display
              v-if="getPointType() === 'unlimited'"
              :point-type="getPointType()"
              :value="sum"
              display-size="larger"
            />
            <review-value-display
              v-else
              :point-type="getPointType()"
              :value="average"
              display-size="larger"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-divider/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <review-values
            :factors="review.reviewFactors"
            :display-type="displayType"
            :point-display-type="pointDisplayType"
            :point-type="getPointType()"
            :review-factor-params="reviewFactorParams"
            @update-point-type="$emit('updatePointType', $event)"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'summary'">
        <v-col>
          <v-card class="ma-3" flat v-if="review.sections.length > 0">
            <section-component :section="review.sections[0]" :display-type="displayType" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <v-card class="ma-3" flat v-for="section,index in review.sections" :key="index">
            <section-component :section="section" :display-type="displayType" />
            <v-divider v-if="index !== (review.sections.length - 1)" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { Review, ReviewDisplayType, ReviewPointDisplayType, ReviewPointType, ReviewFunc, ReviewFactorParam } from '@/common/review'
import CommonApi from '@/common/commonapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'
import ReviewValueDisplay from '@/components/ReviewValueDisplay.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'

export default defineComponent({
  name: 'ReviewCard',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues,
    ReviewValueDisplay,
    PointTypeSelector
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    reviewFactorParams: {
      type: Object as PropType<ReviewFactorParam[]>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    pointDisplayType: {
      type: Object as PropType<ReviewPointDisplayType>,
      default: false as boolean
    },
    noHeader: {
      type: Boolean,
      default: false as boolean
    },
    noChangePoint: {
      type: Boolean,
      default: false as boolean
    },
    width: {
      type: String,
      default: '100%'
    },
    minHeight: {
      type: String,
      default: '100%'
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updateAt, true)
    })

    const average = computed(() => {
      return ReviewFunc.calcAaverage(props.review, props.reviewFactorParams)
    })

    const sum = computed(() => {
      return ReviewFunc.calcSum(props.review, props.reviewFactorParams)
    })

    const baseLink = (process.env.VUE_APP_BASE_URI as string) + '/home/'

    const expansion = ref(false)

    const getPointType = () => {
      return props.pointType || props.review.pointType || 'point'
    }

    return {
      lastWriteTime,
      average,
      sum,
      baseLink,
      expansion,
      getPointType
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
