<template>
  <v-menu bottom v-model="isHover">
    <template v-slot:activator="{ props }">
      <v-card class="ma-1" :width="size" :height="size" @mouseover="hover" @mouseleave="leave" v-bind="props">
        <v-img :src="infomation.review.iconUrl">
        </v-img>
      </v-card>
    </template>
    <v-card width="480px">
      <review-component
        :no-header="true"
        :review="infomation.review"
        :review-factor-params="reviewFactorParams"
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
import ReviewComponent from '@/components/ReviewComponent.vue'
import { defineComponent, PropType, ref } from 'vue'

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
      type: String as PropType<number | string>,
      default: '64px' as string
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
