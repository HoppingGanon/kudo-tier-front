<template>
  <v-container>
    <v-row v-for="review,index in reviews" :key="index">
      <v-col>
        <review-card
          :no-header="noHeader"
          :review="review"
          min-height="200px"
          width="100%"
          :display-type="displayType"
          point-display-type="normal"
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
import { Review, ReviewDisplayType, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'ReviewList',
  components: {
    ReviewCard
  },
  props: {
    reviews: {
      type: Object as PropType<Review[]>
    },
    noHeader: {
      type: Object as PropType<boolean>,
      default: false as boolean
    },
    noChangePoint: {
      type: Object as PropType<boolean>,
      default: false as boolean
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
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
    return {
      updatePointTypeEm
    }
  }
})

</script>
