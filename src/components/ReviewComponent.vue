<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row class="align-center">
      <v-col>
        <review-header
          v-if="!noHeader"
          :icon-url="review.userIconUrl"
          :disp-name="review.userName"
          :user-id="review.userId"
          :last-write-time="lastWriteTime"
        />
      </v-col>
    </v-row>

    <v-row><v-col><v-container class="pa-0 ma-0" fluid :class="isLink ? 'cursor-pointer' : ''" @click="goReview(isLink)">
      <v-row>
        <v-col cols="4" sm="3" md="3" lg="2" xl="2">
          <v-card>
            <v-img v-if="review.iconUrl" :src="review.iconUrl" />
            <v-img v-else src="@/assets/common/noimage256.png"/>
          </v-card>
        </v-col>
        <v-col>
          <v-container fluid class="ma-0 pa-0">
            <v-row>
              <v-col>
                <a :id="review.reviewId">
                  <p :class="$vuetify.display.md || $vuetify.display.lg || $vuetify.display.xl ? 'text-h6' : 'text-subtitle-1'"><span v-text="review.name"></span></p>
                </a>
              </v-col>
            </v-row>
            <v-row v-if="review.title">
              <v-col>
                <p :class="$vuetify.display.md || $vuetify.display.lg || $vuetify.display.xl ? 'text-h5' : 'text-h6'"><b><span v-text="review.title"></span></b></p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <review-large-value
                  :average="average"
                  :sum="sum"
                  :point-type="getPointType()"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="displayType === 'list' && getPointType() !== 'unlimited' && getLabels().length > 2"
            >
              <v-col
                cols="12" sm="6" md="5" lg="4" xl="4"
              >
                <div>
                  <radar-chart
                    :labels="getLabels()"
                    :dataList="getDataList()"
                    :min="0"
                    :max="100"
                    :step="getStep()"
                    :show-legend="false"
                  />
                </div>
              </v-col>
              <v-col v-if="!$vuetify.display.xs" cols="0" sm="6" md="7" lg="8" xl="8">
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
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-container class="ma-0 pa-0" fluid>
              <v-row v-if="!noChangePoint">
                <v-col>
                  <point-type-selector
                    v-if="pointType"
                    :model-value="pointType"
                    @update="$emit('updatePointType', $event)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  v-if="displayType === 'all' && getPointType() !== 'unlimited' && getLabels().length > 2"
                  cols="12" sm="6" md="6" lg="5" xl="5"
                >
                  <div>
                    <radar-chart
                      :labels="getLabels()"
                      :dataList="getDataList()"
                      :min="0"
                      :max="100"
                      :step="100 / getStep()"
                      :show-legend="false"
                    />
                  </div>
                </v-col>
                <v-col>
                  <review-values
                    v-if="displayType === 'all'"
                    :factors="review.reviewFactors"
                    :display-type="displayType"
                    :point-display-type="pointDisplayType"
                    :point-type="getPointType()"
                    :review-factor-params="reviewFactorParams"
                    @update-point-type="$emit('updatePointType', $event)"
                  />
                </v-col>
              </v-row>
            </v-container>
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
      <v-row v-if="displayType === 'summary'">
        <v-col>
          <v-card class="ma-3" flat v-if="review.sections.length > 0">
            <section-component :section="review.sections[0]" :display-type="displayType" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else-if="displayType === 'all' || displayType === 'list'">
        <v-col>
          <v-card class="ma-3" flat v-for="section,index in review.sections" :key="index">
            <section-component :section="section" :display-type="displayType" />
            <v-divider v-if="index !== (review.sections.length - 1)" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'list'">
        <v-col class="d-flex flex-row-reverse">
          <v-btn flat :disabled="isSample" @click="goReview(true)">
            (続きを見る)
          </v-btn>
        </v-col>
      </v-row>
    </v-container></v-col></v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { Review, ReviewDisplayType, ReviewPointDisplayType, ReviewPointType, ReviewFunc, ReviewFactorParam, pointTypeTierCountDic } from '@/common/review'
import CommonApi from '@/common/commonapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import RadarChart, { RadarChartData } from '@/components/RadarChart.vue'
import ReviewLargeValue from '@/components/ReviewLargeValue.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'

export default defineComponent({
  name: 'ReviewComponent',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues,
    PointTypeSelector,
    RadarChart,
    ReviewLargeValue
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    pointDisplayType: {
      type: String as PropType<ReviewPointDisplayType>,
      default: 'normal'
    },
    isSample: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
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
      type: String as PropType<ReviewPointType>
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props) {
    const primaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updatedAt, true)
    })

    const average = computed(() => {
      return ReviewFunc.calcAaverage(props.review, props.reviewFactorParams)
    })

    const sum = computed(() => {
      return ReviewFunc.calcSum(props.review, props.reviewFactorParams)
    })

    const expansion = ref(false)

    const getPointType = () => {
      return props.pointType || props.review.pointType || 'point'
    }

    const getStep = () => 100 / (pointTypeTierCountDic[getPointType()] - 1)

    const getLabels = () => props.reviewFactorParams.filter(v => v.isPoint).map(v => v.name)

    const getDataList: () => RadarChartData[] = () => {
      return [
        {
          name: props.review.name,
          values: props.review.reviewFactors.filter((v, i) => props.reviewFactorParams[i].isPoint && v.point !== undefined).map(v => v.point)
        }
      ] as RadarChartData[]
    }

    const goReview = (enable: boolean) => {
      if (enable) {
        router.push(`/review/${props.review.reviewId}`)
      }
    }

    return {
      primaryColor,
      lastWriteTime,
      average,
      sum,
      expansion,
      getPointType,
      getStep,
      getLabels,
      getDataList,
      goReview
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
