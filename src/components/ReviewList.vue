<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row v-for="review,index in reviews" :key="index">
      <v-col>
        <v-card class="pa-2">
          <review-component
            :no-header="noHeader"
            :review="review"
            :review-factor-params="makeParams(index)"
            :is-sample="isSample"
            :is-link="isLink"
            :display-type="displayType"
            point-display-type="normal"
            :point-type="pointTypes === undefined ? undefined : (index < pointTypes.length ? pointTypes[index] : 'point')"
            @update-point-type="updatePointTypeEm($event, index)"
            :no-change-point="noChangePoint"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import { Review, ReviewDisplayType, ReviewFactorParam, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'ReviewList',
  components: {
    ReviewComponent
  },
  props: {
    reviews: {
      type: Array as PropType<Review[]>,
      required: true
    },
    reviewFactorParams: {
      type: Array as PropType<ReviewFactorParam[] | ReviewFactorParam[][]>,
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
    isSample: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    },
    displayType: {
      type: String as PropType<ReviewDisplayType>,
      required: true
    },
    /** ポイント表示方法を上書きする場合はこのpropを指定する */
    pointTypes: {
      type: Array as PropType<ReviewPointType[]>
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
