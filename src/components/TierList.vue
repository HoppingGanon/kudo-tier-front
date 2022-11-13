<template>
  <v-container>
    <v-row v-for="tier,index in tiers" :key="index">
      <v-col>
        <tier-card
          :tier="tier"
          min-height="200px"
          width="100%"
          display-type="summary"
          point-display-type="normal"
          @update-point-type="updatePointTypeEm($event, index)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tier, ReviewPointType } from '@/common/review'
import TierCard from '@/components/TierCard.vue'

export default defineComponent({
  name: 'TierList',
  components: {
    TierCard
  },
  props: {
    tiers: {
      type: Object as PropType<Tier[]>
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
