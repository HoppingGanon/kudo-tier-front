<template>
  <v-card width="100%" min-height="160px" >
    <v-container>
      <v-row class="align-center">
        <v-col>
          <review-header
            :icon-url="review.userIconUrl"
            :disp-name="review.userName"
            :last-write-time="lastWriteTime"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-h6">{{ review.name }}</p>
            <p class="text-subtitle-1"><b>{{ review.title }}</b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'simple'">
        <v-col>
          <review-values
            :factors="review.reviewFactors"
            :display-type="displayType"
            :point-display-type="pointDisplayType"
            :point-type="review.pointType"
            :review-factor-params="review.reviewFactorParams"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'summary'">
        <v-col>
          <v-card class="ma-3" flat v-if="review.sections.length > 0">
            <section-component :section="review.sections[0]" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else-if="displayType === 'simple'">
        <v-col>
          <v-card class="ma-3" flat v-for="section,index in review.sections" :key="index">
            <section-component :section="section" />
            <v-divider v-if="index !== (review.sections.length - 1)" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Review, ReviewDisplayType, ReviewPointDisplayType, ReviewFactorParam } from '@/common/review'
import CommonApi from '@/common/commonapi'
import SectionComponent from '@/components/SectionComponent.vue'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewValues from '@/components/ReviewValues.vue'

export default defineComponent({
  name: 'ReviewCard',
  components: {
    SectionComponent,
    ReviewHeader,
    ReviewValues
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    pointDisplayType: {
      type: Object as PropType<ReviewPointDisplayType>,
      required: true
    }
  },
  setup (props) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.review.updateAt, true)
    })

    return {
      lastWriteTime
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
