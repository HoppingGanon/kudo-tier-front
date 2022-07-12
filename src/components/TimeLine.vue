<template>
  <v-container>
    <v-row>
      <v-col>
        <review-card
          :disp-name="dispName"
          :icon-url="iconUrl"
          :review="reviews[0]"
          :point-type="pointType"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { Review, ReviewPointType } from '@/common/review'

export default defineComponent({
  name: 'TimeLine',
  components: {
    ReviewCard
  },
  props: {
    dispName: {
      type: String,
      default: ''
    },
    iconUrl: {
      type: String,
      default: ''
    },
    reviews: {
      type: Object as PropType<Review[]>,
      required: true
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      required: true
    }
  },
  emits: {},
  setup () {
    return {}
  }
})

</script>
