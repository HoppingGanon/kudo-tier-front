<template>
  <v-container fluid>
    <v-row v-for="review,index in reviews" :key="index">
      <v-col>
        <review-card
          :no-header="noHeader"
          :review="review"
          :review-factor-params="makeParams(index)"
          min-height="200px"
          width="100%"
          :display-type="displayType"
          point-display-type="normal"
          :point-type="index < pointTypes.length ? pointTypes[index] : 'point'"
          @update-point-type="updatePointTypeEm($event, index)"
          :no-change-point="noChangePoint"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { Review, ReviewDisplayType, ReviewFactorParam, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'ReviewList',
  components: {
    ReviewCard
  },
  props: {
    reviews: {
      type: Object as PropType<Review[]>
    },
    reviewFactorParams: {
      type: Object as PropType<ReviewFactorParam[] | ReviewFactorParam[][]>,
      required: true
    },
    noHeader: {
      type: Boolean,
      default: false as boolean
    },
    noChangePoint: {
      type: Boolean,
      default: false as boolean
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointTypes: {
      type: Object as PropType<ReviewPointType[]>,
      required: true
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType, index: number) => true
  },
  setup (props, { emit }) {
    const updatePointTypeEm = (value: ReviewPointType, index: number) => {
      emit('updatePointType', value, index)
    }

    const makeParams = (index: number) => {
      if (props.reviewFactorParams.length > 0) {
        if (props.reviewFactorParams[0] instanceof Array) {
          if (index < props.reviewFactorParams.length) {
            return props.reviewFactorParams[index] as ReviewFactorParam[]
          }
        } else {
          return props.reviewFactorParams as ReviewFactorParam[]
        }
      }
      return [] as ReviewFactorParam[]
    }
    return {
      updatePointTypeEm,
      makeParams
    }
  }
})

</script>
