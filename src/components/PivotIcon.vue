<template>
  <v-menu bottom v-model="isHover">
    <template  v-slot:activator="{ isActive, props}">
      <v-card class="ma-1" :width="size" :height="size" @mouseover="hover" @mouseleave="leave" v-on="isActive" v-bind="props">
        <v-img :src="infomation.review.iconUrl">
        </v-img>
      </v-card>
    </template>
    <v-card>
      <review-card
        :no-header="true"
        :review="infomation.review"
        :review-factor-params="reviewFactorParams"
        width="480px"
        display-type="summary"
        point-display-type="normal"
        :point-type="pointType"
        :no-change-point="true"
      />
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { ReviewFactorParam, ReviewPointType, TierPivotInfomation } from '@/common/review'
import ReviewCard from '@/components/ReviewCard.vue'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'PivotIcon',
  components: {
    ReviewCard
  },
  props: {
    infomation: {
      type: Object as PropType<TierPivotInfomation>,
      required: true
    },
    size: {
      type: Object as PropType<number | string>,
      default: '64px' as string
    },
    noHover: {
      type: Boolean,
      default: false
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    },
    reviewFactorParams: {
      type: Object as PropType<ReviewFactorParam[]>,
      required: true
    }
  },
  setup () {
    const isHover = ref(false)
    const hover = () => {
      isHover.value = true
    }
    const leave = () => {
      isHover.value = false
    }
    return {
      isHover,
      hover,
      leave
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
</style>
