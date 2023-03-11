<!-- TierRankingPivotで表示するアイコンのコンポーネント -->

<template>
  <v-card v-if="directLink" class="cursor-pointer" :width="size" :height="size" v-scroll-to="`#rev${infomation.review.reviewId}`">
    <v-img v-if="infomation.review.iconUrl" :src="getImgSource(infomation.review.iconUrl)" />
    <v-img v-else src="@/assets/common/noimage256.png"/>
  </v-card>
  <v-menu v-else-if="!$vuetify.display.mobile" bottom v-model="isHover">
    <template v-slot:activator="{ props }">
      <v-card class="" :width="size" :height="size" @click="click" v-bind="props">
        <v-img v-if="infomation.review.iconUrl" :src="getImgSource(infomation.review.iconUrl)" />
        <v-img v-else src="@/assets/common/noimage256.png"/>
      </v-card>
    </template>
    <v-card width="480px" class="no-scroll pa-1">
      <review-component
        :no-header="true"
        :review="infomation.review"
        :review-factor-params="reviewFactorParams"
        display-type="summary"
        :point-type="pointType"
        :no-change-point="true"
        :pulling-up="pullingUp"
        :pulling-down="pullingDown"
      />
      <v-card-actions class="d-flex flex-row-reverse">
        <v-btn flat v-scroll-to="`#rev${infomation.review.reviewId}`">
          移動
        </v-btn>
        <v-btn flat @click="goReview">
          レビューを開く
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
  <v-card v-else class=" cursor-pointer" :width="size" :height="size" v-scroll-to="`#rev${infomation.review.reviewId}`">
    <v-img v-if="infomation.review.iconUrl" :src="getImgSource(infomation.review.iconUrl)" />
    <v-img v-else src="@/assets/common/noimage256.png"/>
  </v-card>
</template>

<script lang="ts">
import { IconSize, ReviewFactorParam, ReviewPointType, TierPivotInfomation } from '@/common/review'
import { getImgSource } from '@/common/restapi'
import ReviewComponent from '@/components/ReviewComponent.vue'
import router from '@/router'
import { computed, defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'PivotIcon',
  components: {
    ReviewComponent
  },
  props: {
    /** 計算済みのレビューの情報 */
    infomation: {
      type: Object as PropType<TierPivotInfomation>,
      required: true
    },
    /** アイコンのサイズ */
    size: {
      type: String as PropType<IconSize>,
      default: '64px' as IconSize
    },
    /** ホバーイベントで略式カードを表示するかどうか */
    noHover: {
      type: Boolean,
      default: false
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    /** レビューの評価項目 */
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    /** クリックするとページ内参照やカード表示をせず、レビュー単独のページに飛ぶ */
    directLink: {
      type: Boolean,
      default: false
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
  setup (props) {
    const isHover = ref(false)
    const click = () => {
      isHover.value = !isHover.value
    }
    const link = computed(() => `/review/${props.infomation.review.reviewId}`)
    const goReview = () => {
      router.push(link.value)
    }
    return {
      getImgSource,
      isHover,
      click,
      link,
      goReview
    }
  }
})
</script>

<style scoped>
.hover {
  transition: all 0.5s 0s ease;
}
.hover-0 {
  opacity: 0;
}
.hover-1 {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.5);
}
.no-scroll {
  /*IE(Internet Explorer)・Microsoft Edgeへの対応*/
  -ms-overflow-style: none;
  /*Firefoxへの対応*/
  scrollbar-width: none;
}
 /*Google Chrome、Safariへの対応*/
.no-scroll::-webkit-scrollbar{
  display: none;
}
</style>
