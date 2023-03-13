<!-- レビュー配列を縦に並べて表示するコンポーネント -->

<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row v-for="pair,index in pairs" :key="index">
      <v-col>
        <v-card class="pa-2">
          <!-- Tierで参照したり、Search等でスクロール検知をするためにIDを振る -->
          <a :id="`rev${pair.review.reviewId}`">
            <review-component
              :no-header="noHeader"
              :review="pair.review"
              :review-factor-params="pairs[index].params"
              :is-sample="isSample"
              :is-link="isLink"
              :display-type="displayType"
              :point-type="pointTypes === undefined ? undefined : (index < pointTypes.length ? pointTypes[index] : 'point')"
              @update-point-type="updatePointTypeEm($event, index)"
              :no-change-point="noChangePoint"
              @reload="$emit('reload')"
              :pulling-up="pair.pullingUp"
              :pulling-down="pair.pullingDown"
            />
          </a>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col>
        <loading-component class="mt-5" title="レビューを取得中..." />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import { ReviewDisplayType, ReviewPointType, ReviewWithParams } from '@/common/review'
import LoadingComponent from '@/components/LoadingComponent.vue'

export default defineComponent({
  name: 'ReviewList',
  components: {
    ReviewComponent,
    LoadingComponent
  },
  props: {
    /** レビューと評点情報のペア */
    pairs: {
      type: Array as PropType<ReviewWithParams[]>,
      required: true
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
    /** サンプルとして表示、trueにするとイベントが発生しない */
    isSample: {
      type: Boolean,
      default: false
    },
    /** レビューをクリックすると単独のレビューページに飛ぶ */
    isLink: {
      type: Boolean,
      default: false
    },
    /** レビューの表示方法 */
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointTypes: {
      type: Array as PropType<ReviewPointType[]>
    },
    /** 読み込み中の表示をする */
    isLoading: {
      type: Boolean,
      default: false
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
      value: ReviewPointType, index: number) => true,
    /** 再読み込みイベント */
    reload: () => true
  },
  setup (props, { emit }) {
    const updatePointTypeEm = (value: ReviewPointType, index: number) => {
      emit('updatePointType', value, index)
    }
    return {
      updatePointTypeEm
    }
  }
})

</script>
