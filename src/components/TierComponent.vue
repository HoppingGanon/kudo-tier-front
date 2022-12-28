<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row class="align-center">
      <v-col>
        <review-header
          v-if="!noHeader"
          :icon-url="tier.userIconUrl"
          :disp-name="tier.userName"
          :user-id="tier.userId"
          :last-write-time="lastWriteTime"
        />
      </v-col>
    </v-row>

    <v-row><v-col><v-container fluid class="ma-0 pa-0" :class="displayType === 'summary' ?'cursor-pointer' : ''" @click="goTier">
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-h6"><b><span v-text="tier.name"></span></b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-img :src="tier.imageUrl" width="100%" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <section-component
            :section="section"
            display-type="all"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <v-card flat>
            <v-divider />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <tier-ranking
            :tier-id="tier.tierId"
            :reviews="tier.reviews"
            :params="tier.reviewFactorParams"
            :point-type="pointType"
            :no-menu-icon="noMenuIcon"
            @updatePointType="$emit('updatePointType', $event)"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <review-list
            :reviews="tier.reviews"
            :review-factor-params="tier.reviewFactorParams"
            :no-header="true"
            :no-change-point="true"
            :point-types="pointTypes"
            display-type="all"
          />
        </v-col>
      </v-row>
    </v-container></v-col></v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ReviewDisplayType, ReviewFactorParam, ReviewPointType, ReviewSection, Tier } from '@/common/review'
import CommonApi from '@/common/commonapi'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierRanking from '@/components/TierRanking.vue'
import SectionComponent from '@/components/SectionComponent.vue'
import router from '@/router'

export default defineComponent({
  name: 'TierComponent',
  components: {
    ReviewHeader,
    ReviewList,
    TierRanking,
    SectionComponent
  },
  props: {
    tier: {
      type: Object as PropType<Tier>,
      required: true
    },
    displayType: {
      type: Object as PropType<ReviewDisplayType>,
      required: true
    },
    noHeader: {
      type: Boolean,
      default: false as boolean
    },
    noMenuIcon: {
      type: Boolean,
      default: false as boolean
    },
    pointType: {
      type: Object as PropType<ReviewPointType>,
      default: 'point' as ReviewPointType
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.tier.updateAt, true)
    })
    const baseLink = (process.env.VUE_APP_BASE_URI as string) + '/home/'
    const pointTypes = computed(() => {
      const objs: ReviewPointType[] = []
      props.tier.reviews.forEach(() => {
        objs.push(props.pointType)
      })
      return objs
    })

    const reviewFactorParamsList = computed(() => {
      const objs: ReviewFactorParam[][] = []
      props.tier.reviews.forEach(() => {
        objs.push(props.tier.reviewFactorParams)
      })
      return objs
    })

    const section = computed(() => {
      return {
        title: '',
        parags: props.tier.parags
      } as ReviewSection
    })

    const goTier = () => {
      if (props.displayType === 'summary') {
        router.push(`/tier/${props.tier.userId}/${props.tier.tierId}`)
      }
    }

    return {
      lastWriteTime,
      pointTypes,
      reviewFactorParamsList,
      section,
      goTier
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
