<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col class="ml-1 mt-1 font-weight-bold">
        <span v-text="tier.name" class="cursor-pointer" @click="goTier"></span>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.display.xs || $vuetify.display.sm || $vuetify.display.md" >
      <v-col class="d-flex">
        <v-card v-for="review, index in tier.reviews" :key="index" class="mb-1 ml-1" width="48px" height="48px">
          <v-img :src="review.iconUrl" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="d-flex">
        <v-list width="100%">
          <v-list-item v-for="review, index in tier.reviews" :key="index" class="cursor-pointer" @click="goReview(review.reviewId)">
            <div style="width: 100%" class="d-flex align-center">
              <v-card width="48px" height="48px">
                <v-img :src="review.iconUrl" />
              </v-card>
              <div class="ml-2">
                <span v-text="review.name" />
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Tier } from '@/common/review'
import router from '@/router'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SimpleTier',
  components: {},
  props: {
    tier: {
      type: Object as PropType<Tier>,
      required: true
    },
    thisReviewId: {
      type: String,
      default: ''
    }
  },
  emits: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup (props) {
    const goTier = () => {
      router.push(`/tier/${props.tier.tierId}`)
    }
    const goReview = (reviewId: string) => {
      router.push(`/review/${reviewId}`)
    }
    return {
      goTier,
      goReview
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
