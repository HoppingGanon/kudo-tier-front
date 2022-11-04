<template>
  <v-container>
    <v-row v-for="review,index in reviews" :key="index">
      <v-col>
        <review-card
          :review="review"
          display-type="simple"
          point-display-type="normal"
          @update-point-type="updatePointTypeEm($event, index)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { Review, ReviewFactorParam, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'ReviewList',
  components: {
    ReviewCard
  },
  props: {
    reviews: {
      type: Object as PropType<Review[]>
    }
  },
  emits: {
    updatePointType: (value: ReviewPointType, index: number) => true
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
