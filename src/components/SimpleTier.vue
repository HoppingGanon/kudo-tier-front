<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row class="cursor-pointer" @click="goTier">
      <v-col class="ml-1 mt-1 font-weight-bold">
        <span v-text="tier.name"></span>
      </v-col>
    </v-row>
    <v-row class="cursor-pointer" @click="goTier">
      <v-col>
        <v-img :src="coverImage"></v-img>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.display.xs || $vuetify.display.sm || $vuetify.display.md" >
      <v-col class="d-flex">
        <v-card v-for="review, index in tier.reviews" :key="index" class="mb-1 ml-1 cursor-pointer" width="48px" height="48px" @click="goReview(review.reviewId)">
          <v-img v-if="review.iconUrl" :src="getImgSource(review.iconUrl)" />
          <v-img v-else src="@/assets/common/noimage256.png"/>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="d-flex">
        <v-list width="100%">
          <v-list-item v-for="review, index in tier.reviews" :key="index" class="cursor-pointer" @click="goReview(review.reviewId)">
            <div style="width: 100%" class="d-flex align-center">
              <v-card width="48px" height="48px">
                <v-img v-if="review.iconUrl" :src="getImgSource(review.iconUrl)" />
                <v-img v-else src="@/assets/common/noimage256.png"/>
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
import { getImgSource } from '@/common/restapi'
import { computed, defineComponent, PropType } from 'vue'

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
    const coverImage = computed(() => {
      return getImgSource(props.tier.imageUrl)
    })
    return {
      getImgSource,
      goTier,
      goReview,
      coverImage
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
