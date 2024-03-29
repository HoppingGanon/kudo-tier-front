<!-- レビューを表示するコンポーネント -->

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

    <v-row v-if="displayType === 'all'">
      <v-col>
        <share-buttons :link="pageLink" :body="twitterBody" />
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
                  <p :class="$vuetify.display.md || $vuetify.display.lg || $vuetify.display.xl ? 'text-h6' : 'text-subtitle-1'"><span v-text="review.name"></span></p>
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
                  :point-type="pointTypeEx"
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
                  v-if="(displayType === 'all' || displayType === 'list') && pointTypeEx !== 'unlimited' && chartLabels.length > 2"
                  cols="12" sm="6" md="6" lg="5" xl="5"
                >
                  <div>
                    <radar-chart
                      :labels="chartLabels"
                      :dataList="chartDataList"
                      :min="-chartStep"
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
                    :point-type="pointTypeEx"
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
      <v-row v-if="isLink">
        <v-col>
          <v-card class="ma-3" flat>
            (クリックしてレビューの続きを読む)
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else-if="displayType === 'summary'">
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
import { defineComponent, PropType, computed, ref, ComputedRef } from 'vue'
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
import ShareButtons from '@/components/ShareButtons.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { SelectObject } from '@/common/page'
import { useToast } from 'vue-toast-notification'
import store from '@/store'
import { calcPointPlainText } from '@/components/ReviewValueDisplay.vue'

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
    SimpleDialog,
    ShareButtons
  },
  props: {
    /** レビューデータ */
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    /** レビューの評価項目の情報 */
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    /** レビューの表示方法 */
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    /** サンプルとして表示、trueにするとイベントが発生しない */
    isSample: {
      type: Boolean,
      default: false
    },
    /** どこをクリックしてもレビューに飛ぶ */
    isLink: {
      type: Boolean,
      default: false
    },
    /** ヘッダ部分を表示しない */
    noHeader: {
      type: Boolean,
      default: false as boolean
    },
    /** ポイント表示方法を固定 */
    noChangePoint: {
      type: Boolean,
      default: false as boolean
    },
    /** 幅 */
    width: {
      type: String,
      default: '100%'
    },
    /** 最小幅 */
    minHeight: {
      type: String,
      default: '100%'
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointType: {
      type: String as PropType<ReviewPointType>
    },
    /** Tier調整値 */
    pullingUp: {
      type: Number,
      required: true
    },
    /** Tier調整値 */
    pullingDown: {
      type: Number,
      required: true
    }
  },
  emits: {
    /**
     * ポイント表示方法を更新する際のイベント
     * @param value ポイント表示方法
     * @param index レビューのインデックス
     */
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true,
    /** レビューをこのコンポーネントから削除した場合などに発火する再読み込みイベント */
    reload: () => true
  },
  setup (props, { emit }) {
    const toast = useToast()
    const primaryColor = vuetify.theme.themes._rawValue.myCustomLightTheme.colors.primary
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updatedAt, true, 1)
    })

    const average = computed(() => {
      return ReviewFunc.calcAaverage(props.review, props.reviewFactorParams, props.pullingUp, props.pullingDown, 0, 100)
    })

    const sum = computed(() => {
      return ReviewFunc.calcSum(props.review, props.reviewFactorParams)
    })

    const expansion = ref(false)

    const pointTypeEx: ComputedRef<ReviewPointType> = computed(() => {
      return props.pointType || props.review.pointType || 'point'
    })

    const chartStep = computed(() => 100 / (pointTypeTierCountDic[pointTypeEx.value] - 1))

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
        value: 'add',
        text: '新しいレビューを追加',
        icon: 'mdi-plus'
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
        case 'add':
          router.push(`/review-settings-new/${props.review.tierId}`)
          break
        case 'delete':
          delDialog.value = true
          break
      }
    }

    const deleteReview = () => {
      RestApi.deleteReview(props.review.reviewId).then(() => {
        toast.success('レビューを削除しました')
        emit('reload')
      }).catch((e) => {
        toastError(e, toast)
      })
    }

    // 親コンポーネントからユーザーIDが来るため、再計算が必要
    const isSelf = computed(() => {
      return store.state.userId === props.review.userId
    })

    const pageLink = computed(() => `${process.env.VUE_APP_BASE_URI}/review/${props.review.reviewId}`)
    const twitterBody = computed(() => {
      const list: string[] = []
      if (isSelf.value) {
        list.push('レビューを投稿しました')
      } else {
        list.push(`${props.review.userName}さんのレビューを共有しました`)
      }

      const val = ReviewFunc.getReviewDisp(pointTypeEx.value === 'unlimited' ? sum.value : average.value, pointTypeEx.value)
      list.push(`${ReviewFunc.getLergeDisplayLabel(pointTypeEx.value)} : ${calcPointPlainText(pointTypeEx.value, val, true)}`)

      list.push(`${props.review.name}`)
      list.push(`${props.review.title}`)

      const text = list.join('\n')
      if (text.length > 100) {
        return `${text.substring(0, 100)}...\n\n`
      } else {
        return `${text}\n\n`
      }
    })

    return {
      menuItems,
      getImgSource,
      primaryColor,
      lastWriteTime,
      average,
      sum,
      expansion,
      pointTypeEx,
      chartStep,
      chartLabels,
      chartDataList,
      goReview,
      delDialog,
      goThere,
      deleteReview,
      isSelf,
      pageLink,
      twitterBody
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
