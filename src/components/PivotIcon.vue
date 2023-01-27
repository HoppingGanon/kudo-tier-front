<template>
  <v-card v-if="directLink" class="ma-1" :width="size" :height="size">
    <a class="no-link" :href="link" target="_top">
      <v-img v-if="infomation.review.iconUrl" :src="getImgSource(infomation.review.iconUrl)" />
      <v-img v-else src="@/assets/common/noimage256.png"/>
    </a>
  </v-card>
  <v-menu v-else bottom v-model="isHover">
    <template v-slot:activator="{ props }">
      <v-card class="ma-1" :width="size" :height="size" @click="click" v-bind="props">
        <v-img v-if="infomation.review.iconUrl" :src="getImgSource(infomation.review.iconUrl)" />
        <v-img v-else src="@/assets/common/noimage256.png"/>
      </v-card>
    </template>
    <v-card width="480px" class="no-scroll">
      <review-component
        :no-header="true"
        :review="infomation.review"
        :review-factor-params="reviewFactorParams"
        display-type="summary"
        :point-type="pointType"
        :no-change-point="true"
      />
      <v-card-actions class="d-flex flex-row-reverse">
        <a :href="`#rev${infomation.review.reviewId}`" class="no-link">
          <v-btn flat>
            移動
          </v-btn>
        </a>
        <v-btn flat @click="goReview">
          レビューを開く
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
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
    infomation: {
      type: Object as PropType<TierPivotInfomation>,
      required: true
    },
    size: {
      type: String as PropType<IconSize>,
      default: '64px' as IconSize
    },
    noHover: {
      type: Boolean,
      default: false
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointType: {
      type: String as PropType<ReviewPointType>,
      required: true
    },
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[]>,
      required: true
    },
    directLink: {
      type: Boolean,
      default: false
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
