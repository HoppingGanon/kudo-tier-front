<template>
  <v-card :width="width" :min-height="minHeight">
    <v-container>
      <v-row class="align-center">
        <v-col>
          <review-header
            v-if="!noHeader"
            :icon-url="tier.userIconUrl"
            :disp-name="tier.userName"
            :user-link="baseLink + tier.userId"
            :last-write-time="lastWriteTime"
            @updatePointType="updatePointTypeEm"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <p class="text-h6"><b><span v-text="tier.name"></span></b></p>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-card v-for="factor, index in tier.factors" :key="index" flat  class="ma-3">
          <span v-if="factor.type === 'text'" v-text="factor.body"></span>
        </v-card>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <v-card flat>
            <v-divider/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <tier-ranking
            :reviews="tier.reviews"
            :params="tier.reviewFactorParams"
          />
        </v-col>
      </v-row>
      <v-row v-if="displayType === 'all'">
        <v-col>
          <review-list
            :reviews="tier.reviews"
            :no-header="true"
            :no-change-point="true"
            display-type="all"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ReviewDisplayType, ReviewPointType, Tier } from '@/common/review'
import CommonApi from '@/common/commonapi'
import ReviewHeader from '@/components/ReviewHeader.vue'
import ReviewList from '@/components/ReviewList.vue'
import TierRanking from './TierRanking.vue'

export default defineComponent({
  name: 'TierCard',
  components: {
    ReviewHeader,
    ReviewList,
    TierRanking
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
      type: Object as PropType<boolean>,
      default: false as boolean
    },
    width: {
      type: String,
      default: '100%'
    },
    minHeight: {
      type: String,
      default: '100%'
    }
  },
  emits: {
    updatePointType: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: ReviewPointType) => true
  },
  setup (props, { emit }) {
    const lastWriteTime = computed(() => {
      return CommonApi.dateToString(props.tier.updateAt, true)
    })

    const updatePointTypeEm = (value: ReviewPointType) => {
      emit('updatePointType', value)
    }

    const baseLink = (process.env.VUE_APP_BASE_URI as string) + '/home/'

    return {
      lastWriteTime,
      updatePointTypeEm,
      baseLink
    }
  }
})
</script>

<style scoped>
@import url("@/style/common-style.css");
</style>
