<template>
  <v-container>
    <v-row v-for="review,index in reviews" :key="index">
      <v-col>
        <review-card
          :review="review"
          display-type="simple"
          point-display-type="normal"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { Review, ReviewFactorParam } from '@/common/review'

export default defineComponent({
  name: 'TimeLine',
  components: {
    ReviewCard
  },
  props: {
    reviews: {
      type: Object as PropType<Review[]>
    }
  },
  emits: {},
  setup () {
    return {}
  }
})

</script>
