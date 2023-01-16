<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row v-if="!noHeader" class="align-center">
      <v-col class="d-flex">
        <div style="width: 100%">
          <review-header
            :icon-url="review.userIconUrl"
            :disp-name="review.userName"
            :user-id="review.userId"
            :last-write-time="lastWriteTime"
          />
        </div>
        <div v-if="isSelf && displayType === 'summary' || displayType === 'list'">
          <menu-button :items="menuItems" @select="goThere($event)">
            <template v-slot:button="{ open, props }">
              <v-btn icon flat @click="open" v-bind="props">
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
          </menu-button>
        </div>
      </v-col>
    </v-row>

    <v-row><v-col><v-container class="pa-0 ma-0" fluid :class="isLink ? 'cursor-pointer' : ''" @click="goReview(isLink)">
      <v-row>
        <v-col cols="4" sm="3" md="3" lg="2" xl="2">
          <v-card>
            <v-img v-if="review.iconUrl" :src="getImgSource(review.iconUrl)" />
            <v-img v-else src="@/assets/common/noimage256.png"/>
          </v-card>
        </v-col>
        <v-col>
          <v-container fluid class="ma-0 pa-0">
            <v-row>
              <v-col class="d-flex">
                <div style="width: 100%">
                  <a :id="`rev${review.reviewId}`">
                    <p :class="$vuetify.display.md || $vuetify.display.lg || $vuetify.display.xl ? 'text-h6' : 'text-subtitle-1'"><span v-text="review.name"></span></p>
                  </a>
                </div>
                <div v-if="isSelf && noHeader && (displayType === 'summary' || displayType === 'list')">
                  <menu-button :items="menuItems" @select="goThere($event)">
                    <template v-slot:button="{ open, props }">
                      <v-icon class="cursor-pointer" @click="open" v-bind="props">
                        mdi-dots-vertical
                      </v-icon>
                    </template>
                  </menu-button>
                </div>
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
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-container class="ma-0 pa-0" fluid>
              <v-row v-if="!noChangePoint">
                <v-col class="d-flex flex-row-reverse">
                  <div>
                    <point-type-selector
                      v-if="pointType"
                      :model-value="pointType"
                      @update="$emit('updatePointType', $event)"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  v-if="(displayType === 'all' || displayType === 'list') && getPointType() !== 'unlimited' && chartLabels.length > 2"
                  cols="12" sm="6" md="6" lg="5" xl="5"
                >
                  <div>
                    <radar-chart
                      :labels="chartLabels"
                      :dataList="chartDataList"
                      :min="0"
                      :max="100"
                      :step="chartStep"
                      :show-legend="false"
                    />
                  </div>
                </v-col>
                <v-col>
                  <review-values
                    v-if="displayType === 'all' || displayType === 'list'"
                    :factors="review.reviewFactors"
                    :display-type="displayType"
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
            <v-divider v-if="index !== (review.sections.length - 1)" class="mt-3 mb-3" />
          </v-card>
        </v-col>
      </v-row>
    </v-container></v-col></v-row>
  </v-container>
  <simple-dialog
    v-model="delDialog"
    title="レビューの削除"
    text="本当にレビューを削除しますか？"
    submit-button-text="削除"
    @submit="deleteReview"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { Review, ReviewDisplayType, ReviewPointType, ReviewFunc, ReviewFactorParam, pointTypeTierCountDic } from '@/common/review'
import CommonApi from '@/common/commonapi'
import RestApi, { getImgSource, toastError } from '@/common/restapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'
import PointTypeSelector from '@/components/PointTypeSelector.vue'
import RadarChart, { RadarChartData } from '@/components/RadarChart.vue'
import ReviewLargeValue from '@/components/ReviewLargeValue.vue'
import MenuButton from '@/components/MenuButton.vue'
import SimpleDialog from '@/components/SimpleDialog.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { SelectObject } from '@/common/page'
import { useToast } from 'vue-toast-notification'
import store from '@/store'

export default defineComponent({
  name: 'ReviewComponent',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues,
    PointTypeSelector,
    RadarChart,
    ReviewLargeValue,
    MenuButton,
    SimpleDialog
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
      value: ReviewPointType) => true,
    reload: () => true
  },
  setup (props, { emit }) {
    const toast = useToast()
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

    const chartStep = computed(() => 100 / (pointTypeTierCountDic[getPointType()] - 1))

    const chartLabels = computed(() => props.reviewFactorParams.filter(v => v.isPoint).map(v => v.name))

    const chartDataList = computed(() => {
      return [
        {
          name: props.review.name,
          values: props.review.reviewFactors.filter((v, i) => props.reviewFactorParams[i].isPoint && v.point !== undefined).map(v => v.point)
        }
      ] as RadarChartData[]
    })

    const goReview = (enable: boolean) => {
      if (enable) {
        router.push(`/review/${props.review.reviewId}`)
      }
    }

    const menuItems: SelectObject[] = [
      {
        value: 'edit',
        text: 'レビューを編集',
        icon: 'mdi-pencil-box-outline'
      },
      {
        value: 'delete',
        text: 'レビューを削除',
        icon: 'mdi-trash-can'
      }
    ]

    const delDialog = ref(false)
    const goThere = (page: string) => {
      switch (page) {
        case 'edit':
          router.push(`/review-settings/${props.review.reviewId}`)
          break
        case 'delete':
          delDialog.value = true
          emit('reload')
          break
      }
    }

    const deleteReview = () => {
      RestApi.deleteReview(props.review.reviewId).then(() => {
        toast.success('レビューを削除しました')
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    // 親コンポーネントからユーザーIDが来るため、再計算が必要
    const isSelf = computed(() => {
      return store.state.userId === props.review.userId
    })

    return {
      menuItems,
      getImgSource,
      primaryColor,
      lastWriteTime,
      average,
      sum,
      expansion,
      getPointType,
      chartStep,
      chartLabels,
      chartDataList,
      goReview,
      delDialog,
      goThere,
      deleteReview,
      isSelf
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
